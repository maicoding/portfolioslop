const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store, max-age=0',
};

const {
  BRAVE_SEARCH_API_KEY = '',
  GIPHY_API_KEY = '',
  NEWS_API_KEY = '',
  OPENAI_API_KEY = '',
  OPENAI_MODEL = 'gpt-5.4-mini',
  GOOGLE_SEARCH_API_KEY = '',
  GOOGLE_SEARCH_CX = '',
} = process.env;

const decodeXml = (value = '') =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const stripTags = (value = '') => decodeXml(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const getTagValue = (xml = '', tagName = '') => {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match?.[1] || '';
};

const pickImageFromItem = (itemXml = '') => {
  const mediaContent = itemXml.match(/<media:content[^>]+url="([^"]+)"/i)?.[1];
  if (mediaContent) return mediaContent;

  const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]+url="([^"]+)"/i)?.[1];
  if (mediaThumbnail) return mediaThumbnail;

  const enclosure = itemXml.match(/<enclosure[^>]+url="([^"]+)"/i)?.[1];
  if (enclosure) return enclosure;

  const description = getTagValue(itemXml, 'description');
  const descriptionImage = description.match(/<img[^>]+src="([^"]+)"/i)?.[1];
  if (descriptionImage) return descriptionImage;

  const contentEncoded = getTagValue(itemXml, 'content:encoded');
  return contentEncoded.match(/<img[^>]+src="([^"]+)"/i)?.[1] || '';
};

const fetchOgImage = async (url) => {
  if (!url) return '';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'portfolio-internet-voice/1.0',
      },
    });

    if (!response.ok) return '';
    const html = await response.text();

    return (
      html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1] ||
      html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i)?.[1] ||
      ''
    );
  } catch {
    return '';
  }
};

const unique = (items = []) => [...new Set(items.filter(Boolean))];
const uniqueBy = (items = [], keyFn = (item) => item) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const shuffle = (items = []) => {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
};

const excerpt = (value = '', maxLength = 220) => {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
};

const hashString = (value = '') =>
  String(value)
    .split('')
    .reduce((accumulator, char) => ((accumulator * 31 + char.charCodeAt(0)) >>> 0), 7);

const buildFeedUrls = (query) => {
  const variants = shuffle(
    unique([
      query,
      `${query} ai internet`,
      `${query} surveillance platform`,
      `${query} design automation`,
      `${query} bot feed`,
    ]),
  ).slice(0, 3);

  return [
    ...variants.map((variant) => `https://news.google.com/rss/search?q=${encodeURIComponent(variant)}&hl=en-US&gl=US&ceid=US:en`),
    'https://feeds.arstechnica.com/arstechnica/index',
    'https://techcrunch.com/category/artificial-intelligence/feed/',
    'https://www.engadget.com/tag/ai/rss.xml',
    'https://www.theverge.com/rss/index.xml',
  ];
};

const fetchJson = async (url, init) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`json fetch failed with ${response.status}`);
  return response.json();
};

const fetchFeedItems = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'portfolio-internet-voice/1.0',
      Accept: 'application/rss+xml, application/xml, text/xml;q=0.9',
    },
  });

  if (!response.ok) throw new Error(`feed failed with ${response.status}`);

  const xml = await response.text();
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  const parsed = await Promise.all(
    items.slice(0, 8).map(async (itemXml) => {
      const title = stripTags(getTagValue(itemXml, 'title'));
      const link = stripTags(getTagValue(itemXml, 'link'));
      const description = stripTags(getTagValue(itemXml, 'description'));
      const image = pickImageFromItem(itemXml) || (await fetchOgImage(link));

      return {
        title,
        description,
        link,
        image,
      };
    }),
  );

  return parsed.filter((item) => item.title || item.description);
};

const fetchWikipediaTrace = async (term) => {
  const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrlimit=4&prop=extracts|pageimages|description&exintro=1&explaintext=1&exchars=360&pithumbsize=1200`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`wikipedia failed with ${response.status}`);

  const payload = await response.json();
  return Object.values(payload.query?.pages || {})
    .map((page) => ({
      title: page.title || '',
      description: page.description || '',
      extract: page.extract || '',
      image: page.thumbnail?.source || '',
      url: page.title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/\s+/g, '_'))}` : '',
    }))
    .filter((page) => page.title || page.extract || page.image);
};

const fetchInternetArchiveTrace = async (term) => {
  const query = encodeURIComponent(`(${term}) AND mediatype:texts`);
  const url = `https://archive.org/advancedsearch.php?q=${query}&fl[]=identifier&fl[]=title&fl[]=description&rows=6&page=1&output=json`;
  const payload = await fetchJson(url);

  return (payload.response?.docs || [])
    .map((doc) => ({
      title: doc.title || doc.identifier || '',
      description: Array.isArray(doc.description) ? doc.description[0] : doc.description || '',
      extract: doc.identifier || '',
      image: doc.identifier ? `https://archive.org/services/img/${encodeURIComponent(doc.identifier)}` : '',
      url: doc.identifier ? `https://archive.org/details/${encodeURIComponent(doc.identifier)}` : '',
      sourceType: 'internet archive',
    }))
    .filter((doc) => doc.title || doc.description || doc.image);
};

const fetchHnTrace = async (term) => {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(term)}&tags=story&hitsPerPage=6`;
  const payload = await fetchJson(url);

  return (payload.hits || [])
    .map((hit) => ({
      title: hit.title || hit.story_title || '',
      description: hit._highlightResult?.title?.value?.replace(/<[^>]+>/g, ' ') || '',
      extract: hit.url || hit.story_url || '',
      image: '',
      url: hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      sourceType: 'hacker news',
    }))
    .filter((hit) => hit.title || hit.extract);
};

const fetchStackExchangeTrace = async (term) => {
  const url = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(term)}&site=stackoverflow&pagesize=6&filter=withbody`;
  const payload = await fetchJson(url);

  return (payload.items || [])
    .map((item) => ({
      title: stripTags(item.title || ''),
      description: excerpt(stripTags(item.body || ''), 220),
      extract: item.link || '',
      image: '',
      url: item.link || '',
      sourceType: 'stack exchange',
    }))
    .filter((item) => item.title || item.description);
};

const fetchBraveTrace = async (term) => {
  if (!BRAVE_SEARCH_API_KEY) return [];

  const payload = await fetchJson(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(term)}&count=6`, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': BRAVE_SEARCH_API_KEY,
    },
  });

  return (payload.web?.results || [])
    .map((item) => ({
      title: item.title || '',
      description: item.description || '',
      extract: item.url || '',
      image: '',
      url: item.url || '',
      sourceType: 'brave search',
    }))
    .filter((item) => item.title || item.description);
};

const fetchNewsApiTrace = async (term) => {
  if (!NEWS_API_KEY) return [];

  const payload = await fetchJson(`https://newsapi.org/v2/everything?q=${encodeURIComponent(term)}&pageSize=6&sortBy=publishedAt&language=en`, {
    headers: {
      'X-Api-Key': NEWS_API_KEY,
    },
  });

  return (payload.articles || [])
    .map((article) => ({
      title: article.title || '',
      description: article.description || article.content || '',
      extract: article.url || '',
      image: article.urlToImage || '',
      url: article.url || '',
      sourceType: 'newsapi',
    }))
    .filter((article) => article.title || article.description || article.image);
};

const fetchGoogleSearchTrace = async (term) => {
  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_CX) return [];

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(
      GOOGLE_SEARCH_API_KEY,
    )}&cx=${encodeURIComponent(GOOGLE_SEARCH_CX)}&q=${encodeURIComponent(term)}&searchType=image&num=6`;

    const payload = await fetchJson(url);

    return (payload.items || [])
      .map((item) => ({
        title: item.title || '',
        description: item.snippet || '',
        extract: item.link || '',
        image: item.link || item.image?.thumbnailLink || '',
        url: item.image?.contextLink || '',
        sourceType: 'google search',
      }))
      .filter((item) => item.title || item.image);
  } catch {
    return [];
  }
};

const fetchGifTrace = async (term, randomId = '', requestSeed = '') => {
  const gifs = [];
  const baseSeed = hashString(`${term}-${randomId}-${requestSeed}`);
  const terms = unique([
    term,
    ...term.split(/\s+/).filter((token) => token.length > 4),
    `${term} internet`,
    `${term} glitch`,
    `${term} ai`,
  ]).slice(0, 5);

  if (GIPHY_API_KEY) {
    try {
      const searchPayloads = await Promise.all(
        terms.map((queryTerm, index) =>
          fetchJson(
            `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(GIPHY_API_KEY)}&q=${encodeURIComponent(
              queryTerm,
            )}&limit=18&offset=${(baseSeed + index * 37) % 240}&rating=pg`,
          ),
        ),
      );

      gifs.push(
        ...searchPayloads.flatMap((payload) =>
          (payload.data || []).map((gif) => ({
            id: gif.id,
            embedUrl: `https://giphy.com/embed/${gif.id}`,
            href: gif.url || `https://giphy.com/gifs/${gif.id}`,
            title: gif.title || term,
            sourceType: 'giphy',
          })),
        ),
      );
    } catch {
      // ignore provider failure
    }
  }

  return uniqueBy(
    shuffle(gifs)
      .sort((left, right) => {
        const leftScore = hashString(`${left.id || left.href}-${requestSeed}`);
        const rightScore = hashString(`${right.id || right.href}-${requestSeed}`);
        return leftScore - rightScore;
      })
      .filter((gif) => gif.embedUrl || gif.href),
    (gif) => gif.id || gif.href,
  );
};

const extractQuestionTokens = (question = '') =>
  unique(
    question
      .toLowerCase()
      .replace(/[?.,]/g, '')
      .split(/\s+/)
      .filter((token) => token.length > 4),
  ).slice(0, 6);

const buildFragments = (question, feeds = [], pages = []) => {
  const feedLines = feeds.flatMap((item) => [item.title, item.description]).filter(Boolean);
  const pageLines = pages.flatMap((page) => [page.title, page.description, ...(page.extract || '').split(/(?<=[.!?])\s+/)]).filter(Boolean);
  const pool = shuffle(unique([...feedLines, ...pageLines].map((line) => excerpt(line.toLowerCase(), 180)).filter((line) => line.length > 18)));

  if (!pool.length) return [];

  const modes = [
    () => pool.slice(0, 3),
    () => [pool[0], question.toLowerCase(), pool[1] || pool[0]],
    () => pool.slice(0, 2).map((line) => line.replace(/^[a-z]/, (char) => char.toUpperCase())),
    () => [pool[0], pool[2] || pool[1] || pool[0], question.toLowerCase()],
    () => [excerpt(pool[0] || '', 90), excerpt(pool[1] || '', 130), excerpt(pool[2] || '', 100)],
  ];

  return (shuffle(modes)[0] || modes[0])();
};

const buildImageCandidates = (feeds = [], pages = []) =>
  uniqueBy(
    shuffle([
      ...feeds
        .filter((item) => item.image)
        .map((item) => ({
          url: item.image,
          title: item.title || '',
          source: item.link || '',
          label: 'news feed',
        })),
      ...pages
        .filter((page) => page.image)
        .map((page) => ({
          url: page.image,
          title: page.title || '',
          source: page.url || '',
          label: 'wikipedia',
        })),
    ]),
    (item) => item.url,
  );

const buildSearchPages = (results = []) =>
  results.map((item) => ({
    title: item.title || '',
    description: item.description || '',
    extract: item.extract || '',
    image: item.image || '',
    url: item.url || '',
    sourceType: item.sourceType || 'search',
  }));

const fetchAiFragments = async (question, feeds = [], pages = []) => {
  if (!OPENAI_API_KEY) return [];

  const contextLines = shuffle(
    unique([
      ...feeds.flatMap((item) => [item.title, item.description]),
      ...pages.flatMap((item) => [item.title, item.description, item.extract]),
    ])
      .map((line) => excerpt(String(line || '').trim(), 180))
      .filter((line) => line.length > 20),
  ).slice(0, 8);

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: 'Answer as the internet half-dreaming. Write exactly 3 short lines, lower-case, no bullets, no numbering, no explanation. Blend web residue, public memory, and unstable certainty.',
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `question:\n${question}\n\ninternet traces:\n${contextLines.join('\n')}`,
              },
            ],
          },
        ],
        max_output_tokens: 120,
      }),
    });

    if (!response.ok) return [];
    const payload = await response.json();
    const text =
      payload.output_text ||
      payload.output
        ?.flatMap((item) => item.content || [])
        .map((item) => item.text || '')
        .join('\n') ||
      '';

    return text
      .split(/\n+/)
      .map((line) => excerpt(line.toLowerCase(), 160))
      .filter((line) => line.length > 8)
      .slice(0, 3);
  } catch {
    return [];
  }
};

export const handler = async (event) => {
  try {
    const question = String(event.queryStringParameters?.q || '').trim();
    if (!question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'missing question',
        }),
      };
    }
    const giphyRandomId = String(event.queryStringParameters?.rid || '').trim();
    const requestSeed = String(event.queryStringParameters?.rv || '').trim();
    const cleanQuestion = question;
    const query = extractQuestionTokens(cleanQuestion).join(' ') || cleanQuestion;

    const [wikiA, wikiB, archiveA, hnA, stackA, braveA, newsApiA, gifA, googleA, ...feedResults] = await Promise.allSettled([
      fetchWikipediaTrace(query),
      fetchWikipediaTrace(`${query} internet art`),
      fetchInternetArchiveTrace(query),
      fetchHnTrace(query),
      fetchStackExchangeTrace(query),
      fetchBraveTrace(query),
      fetchNewsApiTrace(query),
      fetchGifTrace(query, giphyRandomId, requestSeed),
      fetchGoogleSearchTrace(query),
      ...buildFeedUrls(query).map((url) => fetchFeedItems(url)),
    ]);

    const pages = shuffle([
      ...(wikiA.status === 'fulfilled' ? wikiA.value : []),
      ...(wikiB.status === 'fulfilled' ? wikiB.value : []),
      ...buildSearchPages(archiveA.status === 'fulfilled' ? archiveA.value : []),
      ...buildSearchPages(hnA.status === 'fulfilled' ? hnA.value : []),
      ...buildSearchPages(stackA.status === 'fulfilled' ? stackA.value : []),
      ...buildSearchPages(braveA.status === 'fulfilled' ? braveA.value : []),
      ...buildSearchPages(newsApiA.status === 'fulfilled' ? newsApiA.value : []),
      ...buildSearchPages(googleA.status === 'fulfilled' ? googleA.value : []),
    ]);

    const feeds = shuffle(feedResults.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])));
    const aiFragments = await fetchAiFragments(cleanQuestion, feeds, pages);
    const fragments = shuffle(unique([...buildFragments(cleanQuestion, feeds, pages), ...aiFragments])).slice(0, 5);
    const images = buildImageCandidates(feeds, pages).slice(0, 10);
    const parsedLeadImage = images.find((item) => item.url) || null;
    const gifs = shuffle(gifA.status === 'fulfilled' ? gifA.value : []).slice(0, 6);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        fragments,
        aiFragments,
        pages: pages.slice(0, 4),
        images,
        gifs,
        image: parsedLeadImage,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown internet voice error',
      }),
    };
  }
};
