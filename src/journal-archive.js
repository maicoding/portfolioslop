const namedEntities = {
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  nbsp: ' ',
  ndash: '-',
  mdash: '-',
  hellip: '...',
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
};

function decodeEntities(value = '') {
  return String(value)
    .replace(/&#x([0-9a-f]+);?/gi, (match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    })
    .replace(/&#(\d+);?/g, (match, num) => {
      const codePoint = Number.parseInt(num, 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    })
    .replace(/&([a-z]+);/gi, (match, entity) => namedEntities[entity.toLowerCase()] ?? match);
}

function normalizeText(value = '') {
  return decodeEntities(String(value))
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bift\.tt\/\S+/gi, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(value = '', maxLength = 170) {
  const clean = normalizeText(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
}

function scoreTrend(text, trends) {
  const lower = text.toLowerCase();

  const scored = trends
    .map((trend) => ({
      id: trend.id,
      score: trend.keywords.reduce((total, keyword) => total + (lower.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 2).map((entry) => entry.id);
}

export async function fetchArchiveSignals(trends) {
  const response = await fetch('/.netlify/functions/archive-feed');
  if (!response.ok) {
    throw new Error(`Archive request failed with ${response.status}`);
  }

  const payload = await response.json();
  const archive = Array.isArray(payload.archive) ? payload.archive : [];

  return archive.slice(0, 18).map((item, index) => {
    const sourceText = normalizeText(item.title || item.content || '');
    const detailText = normalizeText(item.content || item.title || '');
    const combined = `${sourceText} ${detailText}`.trim();

    return {
      id: item.id || `archive-${index}`,
      text: excerpt(sourceText || detailText),
      detail: excerpt(detailText, 220),
      href: item.href || '',
      source: item.source || 'archive',
      sourceLabel: item.sourceLabel || item.author || item.source || 'archive',
      sourceGroup: String(item.sourceLabel || item.author || item.source || 'archive').includes('google-alert')
        ? 'alert'
        : String(item.sourceLabel || item.author || item.source || 'archive').includes('google-news')
          ? 'news'
          : 'archive',
      createdAt: item.timestamp || new Date().toISOString(),
      trendIds: scoreTrend(combined, trends),
    };
  });
}
