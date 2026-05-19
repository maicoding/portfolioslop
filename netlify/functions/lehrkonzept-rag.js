import fs from 'fs';
import path from 'path';
import {
  retrieveLehrkonzeptChunks,
  tokenizeLehrkonzeptText,
} from '../../src/lehrkonzept-rag-data.js';

const modelName = 'gemini-2.5-flash';

function readLocalEnvValue(name) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return '';

    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      if (key !== name) continue;
      return trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (error) {
    console.error('Failed to read local .env file', error);
  }

  return '';
}

function getApiKey() {
  return process.env.GEMINI_API_KEY || readLocalEnvValue('GEMINI_API_KEY');
}

function buildGroundedFallback(question, chunks) {
  const [primary, secondary] = chunks;
  const explanation = primary?.explanation || '';
  const example = primary?.example ? ` ${primary.example}` : '';
  const bridge = secondary?.explanation ? ` Ergänzend ist wichtig: ${secondary.explanation}` : '';

  return {
    answer: `${explanation}${example}${bridge}`.trim(),
    grounded: true,
    model: 'retrieval-only',
    sources: chunks.map(({ id, title, category }) => ({ id, title, category })),
    question,
  };
}

function isQuestionGrounded(question, chunks) {
  const tokens = tokenizeLehrkonzeptText(question);
  if (!tokens.length) return false;
  if (!chunks.length) return false;
  const covered = new Set(
    chunks.flatMap((chunk) =>
      tokenizeLehrkonzeptText([
        chunk.title,
        ...(chunk.tags || []),
        ...(chunk.questionVariants || []),
        chunk.explanation,
        ...(chunk.skills || []),
        chunk.example,
      ].join(' ')),
    ),
  );

  const overlap = tokens.filter((token) => covered.has(token)).length;
  return overlap >= Math.max(1, Math.ceil(tokens.length * 0.25));
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const body = await req.json().catch(() => ({}));
  const question = String(body?.question || '').trim();

  if (!question) {
    return new Response(JSON.stringify({ error: 'Missing question.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const retrievedChunks = retrieveLehrkonzeptChunks(question, 4);
  if (!retrievedChunks.length || !isQuestionGrounded(question, retrievedChunks)) {
    return new Response(
      JSON.stringify({
        answer:
          'Dazu finde ich in der hinterlegten Wissensbasis des Lehrkonzepts keine ausreichende Grundlage. Ich antworte deshalb lieber nicht spekulativ.',
        grounded: false,
        model: 'retrieval-only',
        sources: [],
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return new Response(JSON.stringify(buildGroundedFallback(question, retrievedChunks)), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const context = retrievedChunks
    .map(
      (chunk, index) => `Quelle ${index + 1}
id: ${chunk.id}
title: ${chunk.title}
category: ${chunk.category}
type: ${chunk.type}
tags: ${(chunk.tags || []).join(', ')}
questionVariants: ${(chunk.questionVariants || []).join(' | ')}
explanation: ${chunk.explanation}
example: ${chunk.example}`,
    )
    .join('\n\n');

  const systemInstruction = `
Du beantwortest Fragen ausschliesslich auf Basis der bereitgestellten Lehrkonzept-Quellen.
Regeln:
- Nutze nur Informationen, die in den Quellen enthalten sind.
- Erfinde keine Vitae, Projekte, Haltungen oder Methoden ausserhalb der Quellen.
- Wenn die Quellen fuer eine belastbare Antwort nicht ausreichen, antworte exakt: "Dazu finde ich in der hinterlegten Wissensbasis des Lehrkonzepts keine ausreichende Grundlage."
- Antworte auf Deutsch.
- Antworte knapp, praezise und ohne Marketing-Sprache.
- Formuliere keine Fakten als sicher, wenn sie nicht direkt in den Quellen stehen.
`;

  const prompt = `Frage: ${question}

Lehrkonzept-Quellen:
${context}

Aufgabe:
Beantworte die Frage in 3 bis 6 Saetzen ausschliesslich auf Basis der Quellen.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      const apiError = result?.error?.message || result?.message || 'Gemini request failed.';
      return new Response(JSON.stringify({ ...buildGroundedFallback(question, retrievedChunks), warning: apiError }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    const answer =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Dazu finde ich in der hinterlegten Wissensbasis des Lehrkonzepts keine ausreichende Grundlage.';

    return new Response(
      JSON.stringify({
        answer,
        grounded: !answer.includes('keine ausreichende Grundlage'),
        model: modelName,
        sources: retrievedChunks.map(({ id, title, category }) => ({ id, title, category })),
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify(buildGroundedFallback(question, retrievedChunks)), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
}
