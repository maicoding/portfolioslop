function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function extractJson(text = '') {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON found in AI response.');
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function scoreTrendMatch(text, trends) {
  const lower = text.toLowerCase();
  return trends
    .map((trend) => ({
      id: trend.id,
      score: trend.keywords.reduce((total, keyword) => total + (lower.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((entry) => entry.id);
}

function normalizeArtifact(data, question, trends, relatedResponses) {
  const fallbackTrendIds = scoreTrendMatch(
    `${question} ${Array.isArray(data.fragments) ? data.fragments.join(' ') : ''} ${data.summary || ''}`,
    trends,
  );

  const trendIds = Array.isArray(data.trendIds) ? data.trendIds.filter((id) => trends.some((trend) => trend.id === id)) : fallbackTrendIds;
  const responseIds = Array.isArray(data.relatedResponses)
    ? data.relatedResponses.filter((id) => relatedResponses[id])
    : [];

  return {
    id: `artifact-${Date.now()}-${slugify(question) || 'question'}`,
    question,
    title: data.title || 'Untitled Artifact',
    summary: data.summary || '',
    fragments: Array.isArray(data.fragments) ? data.fragments.slice(0, 4).map((item) => String(item).trim()).filter(Boolean) : [],
    trendIds,
    artifactType: data.artifactType || 'trend-reading',
    sourceHints: Array.isArray(data.sourceHints) ? data.sourceHints.slice(0, 3) : [],
    relatedResponses: responseIds,
    createdAt: new Date().toISOString(),
  };
}

function buildFallbackArtifact(question, trends, relatedResponses, context) {
  const trendIds = scoreTrendMatch(question, trends);
  const pickedTrend = trends.find((trend) => trend.id === trendIds[0]) || trends[0];
  const suggestedResponses = (pickedTrend?.relatedResponses || []).filter((id) => relatedResponses[id]).slice(0, 2);
  const fragments = context.fragments.slice(0, 3).map((entry) => entry.text);

  return {
    id: `artifact-${Date.now()}-${slugify(question) || 'question'}`,
    question,
    title: pickedTrend ? pickedTrend.label : 'Question Trace',
    summary: pickedTrend ? pickedTrend.long : 'Die Frage wurde als neue Spur in das Journal aufgenommen.',
    fragments: fragments.length ? fragments : [question],
    trendIds,
    artifactType: 'trace-bundle',
    sourceHints: ['fallback'],
    relatedResponses: suggestedResponses,
    createdAt: new Date().toISOString(),
  };
}

export async function createArtifact(question, trends, relatedResponses, context) {
  const systemInstruction = `Du erzeugst aus einer Nutzerfrage ein Journal-Artefakt. Antworte nur als JSON.
Schema:
{
  "title": "kurzer Titel",
  "summary": "2 bis 4 Saetze",
  "fragments": ["kurzer Satz", "kurzer Satz"],
  "trendIds": ["trend-id"],
  "artifactType": "signal|trend-reading|trace-bundle",
  "sourceHints": ["essay", "archive"],
  "relatedResponses": ["response-id"]
}
Regeln:
- keine Erklaerung ausserhalb des JSON
- maximal 4 Fragmente
- Fragmente nicht werblich, eher praezise, essayistisch, leicht fragmentarisch
- nur diese trendIds verwenden: ${trends.map((trend) => trend.id).join(', ')}
- nur diese relatedResponses verwenden: ${Object.keys(relatedResponses).join(', ')}
- wenn keine sichere Zuordnung moeglich ist, trendIds leer lassen`;

  const prompt = JSON.stringify({
    question,
    trends: trends.map((trend) => ({
      id: trend.id,
      label: trend.label,
      short: trend.short,
      long: trend.long,
    })),
    context,
  });

  try {
    const response = await fetch('/.netlify/functions/gemini-proxy', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed with ${response.status}`);
    }

    const payload = await response.json();
    const parsed = extractJson(payload.text || '');
    return normalizeArtifact(parsed, question, trends, relatedResponses);
  } catch {
    return buildFallbackArtifact(question, trends, relatedResponses, context);
  }
}
