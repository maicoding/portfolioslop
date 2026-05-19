const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=60',
};

const feedSources = [
  {
    name: 'ars',
    tag: '#ars #rss',
    kind: 'feed',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
  },
  {
    name: 'techcrunch',
    tag: '#techcrunch #rss',
    kind: 'ai',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },
  {
    name: 'techcrunch-general',
    tag: '#techcrunch #rss',
    kind: 'interface',
    url: 'https://techcrunch.com/feed/',
  },
  {
    name: 'engadget',
    tag: '#engadget #rss',
    kind: 'feed',
    url: 'https://www.engadget.com/rss.xml',
  },
  {
    name: 'engadget-ai',
    tag: '#engadget #ai',
    kind: 'ai',
    url: 'https://www.engadget.com/tag/ai/rss.xml',
  },
  {
    name: 'google-news-ai',
    tag: '#google-news #ai',
    kind: 'ai',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+OR+openai+OR+anthropic&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'google-news-tech',
    tag: '#google-news #tech',
    kind: 'feed',
    url: 'https://news.google.com/rss/search?q=tech+platforms+OR+internet+OR+search&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'google-news-cyber',
    tag: '#google-news #cyber',
    kind: 'surveillance',
    url: 'https://news.google.com/rss/search?q=cybersecurity+OR+surveillance+OR+data+breach&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'google-news-datacenter',
    tag: '#google-news #datacenter',
    kind: 'interface',
    url: 'https://news.google.com/rss/search?q=data+center+OR+chip+OR+nvidia+OR+oracle+ai&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'google-news-war',
    tag: '#google-news #conflict',
    kind: 'feed',
    url: 'https://news.google.com/rss/search?q=iran+OR+israel+OR+missile+OR+gas+infrastructure&hl=en-US&gl=US&ceid=US:en',
  },
];

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

const getAttributeValue = (xml = '', attribute = '') => {
  const match = xml.match(new RegExp(`${attribute}="([^"]+)"`, 'i'));
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
        'User-Agent': 'portfolio-rss-media/1.0',
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

const fetchFeedMedia = async (source) => {
  const response = await fetch(source.url, {
    headers: {
      'User-Agent': 'portfolio-rss-media/1.0',
      Accept: 'application/rss+xml, application/xml, text/xml;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`${source.name} returned ${response.status}`);
  }

  const xml = await response.text();
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  const parsed = await Promise.all(
    items.slice(0, 18).map(async (itemXml) => {
      const title = stripTags(getTagValue(itemXml, 'title'));
      const link = stripTags(getTagValue(itemXml, 'link'));
      const image = pickImageFromItem(itemXml) || (await fetchOgImage(link));

      if (!image) return null;

      return {
        caption: `${source.tag} #news-image`,
        credit: title || source.name,
        src: image,
        href: link,
        kind: source.kind,
      };
    }),
  );

  return parsed.filter(Boolean);
};

export const handler = async () => {
  try {
    const settled = await Promise.allSettled(feedSources.map((source) => fetchFeedMedia(source)));
    const items = settled
      .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
      .filter((item, index, array) => item?.src && array.findIndex((entry) => entry.src === item.src) === index)
      .sort(() => Math.random() - 0.5)
      .slice(0, 60);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        items,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown RSS media fetch error',
        items: [],
      }),
    };
  }
};
