import fs from 'fs';
import path from 'path';

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

export default async function handler(req) {
  if (req.method === 'GET') {
    const apiKey = getApiKey();
    return new Response(JSON.stringify({
      ok: true,
      function: 'gemini-proxy',
      hasApiKey: Boolean(apiKey),
      model: modelName,
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API key missing on server.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const body = await req.json();
  const prompt = body?.prompt;
  const systemInstruction = body?.systemInstruction;

  if (!prompt || !systemInstruction) {
    return new Response(JSON.stringify({ error: 'Missing prompt or systemInstruction.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    const apiError = result?.error?.message || result?.message || 'Gemini request failed.';
    return new Response(JSON.stringify({ error: apiError, details: result }), {
      status: response.status,
      headers: { 'content-type': 'application/json' },
    });
  }

  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Stille.';

  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
