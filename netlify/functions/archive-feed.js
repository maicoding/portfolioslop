import { connectLambda, getStore } from '@netlify/blobs';
import { handler as rssMediaHandler } from './rss-media.js';
import { handler as discordFeedHandler } from './discord-feed.js';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
};

const storeName = 'global-link-archive';
const archiveKey = 'entries.json';
const maxArchiveEntries = 500;
const perSourceLimit = 5;
const curatedTextFeeds = [
  {
    id: 'google-alert-dead-internet',
    sourceLabel: '#google-alert #dead-internet',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/7295213983986586682',
  },
  {
    id: 'google-alert-ai-signal',
    sourceLabel: '#google-alert #ai-signal',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/4763482021306946853',
  },
  {
    id: 'google-alert-platform-signal',
    sourceLabel: '#google-alert #platform-signal',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/12774061448820187558',
  },
  {
    id: 'google-alert-search-signal',
    sourceLabel: '#google-alert #search-signal',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/2000325427142653633',
  },
  {
    id: 'google-alert-interface-signal',
    sourceLabel: '#google-alert #interface-signal',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/15152509710221240333',
  },
  {
    id: 'google-alert-bot-signal',
    sourceLabel: '#google-alert #bot-signal',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/4394519202746722555',
  },
  {
    id: 'google-alert-automation-signal',
    sourceLabel: '#google-alert #automation-signal',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/8485038675430619583',
  },
  {
    id: 'google-alert-generated-media',
    sourceLabel: '#google-alert #generated-media',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/1969384072845138571',
  },
  {
    id: 'google-alert-platform-drift',
    sourceLabel: '#google-alert #platform-drift',
    url: 'https://www.google.com/alerts/feeds/04949984583786418850/1969384072845137812',
  },
  {
    id: 'google-news-ai',
    sourceLabel: '#google-news #ai',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+OR+openai+OR+anthropic+OR+synthetic+media&hl=en-US&gl=US&ceid=US:en',
  },
  {
    id: 'google-news-dead-internet',
    sourceLabel: '#google-news #dead-internet',
    url: 'https://news.google.com/rss/search?q=%22dead+internet%22+OR+bots+OR+content+farm+OR+ai+slop&hl=en-US&gl=US&ceid=US:en',
  },
  {
    id: 'google-news-search',
    sourceLabel: '#google-news #search',
    url: 'https://news.google.com/rss/search?q=ai+search+OR+answer+engine+OR+agentic+browsing+OR+search+interface&hl=en-US&gl=US&ceid=US:en',
  },
];
const topicalPattern =
  /(artificial intelligence|openai|anthropic|machine learning|synthetic media|dead internet|ai slop|bot|bots|content farm|search interface|answer engine|agentic|algorithm|surveillance|platform|automation|generated content)/i;

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

const normalizeRssItems = (items = []) =>
  items.slice(0, perSourceLimit).map((item, index) => ({
    id: `rss:${item.id || item.src || item.href || `rss-${index}`}`,
    source: 'rss',
    sourceLabel: item.source || item.caption || '#rss',
    title: sanitizeFeedText(item.title || item.credit || 'RSS signal detected'),
    href: item.href || '',
    author: item.source || item.caption || '#rss',
    content: sanitizeFeedText(item.title || item.credit || 'RSS signal detected'),
    timestamp: item.timestamp || new Date(Date.now() - index * 600000).toISOString(),
  }));

const normalizeDiscordItems = (items = []) =>
  items.slice(0, perSourceLimit).map((item, index) => ({
    id: `discord:${item.id || item.timestamp || item.author || `discord-${index}`}`,
    source: 'discord',
    author: item.author || 'discord',
    href: item.href || extractFirstUrl(item.content || ''),
    content: sanitizeFeedText(item.content || ''),
    timestamp: item.timestamp || new Date(Date.now() - index * 600000).toISOString(),
  }));

const decodeXml = (value = '') =>
  String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);?/gi, (match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    })
    .replace(/&#(\d+);?/g, (match, num) => {
      const codePoint = Number.parseInt(num, 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    })
    .replace(/&([a-z]+);/gi, (match, entity) => namedEntities[entity.toLowerCase()] ?? match);

const stripTags = (value = '') => decodeXml(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const extractFirstUrl = (value = '') => String(value).match(/https?:\/\/\S+/i)?.[0] || '';

const sanitizeFeedText = (value = '') =>
  stripTags(value)
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bift\.tt\/\S+/gi, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const getTagValue = (xml = '', tagName = '') => {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match?.[1] || '';
};

const isTopical = (value = '') => topicalPattern.test(value);

const fetchCuratedFeedItems = async () => {
  const settled = await Promise.allSettled(
    curatedTextFeeds.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'portfolio-archive-feed/1.0',
          Accept: 'application/rss+xml, application/xml, text/xml;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`${feed.id} returned ${response.status}`);
      }

      const xml = await response.text();
      const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

      return items.slice(0, perSourceLimit).map((itemXml, index) => {
        const title = sanitizeFeedText(getTagValue(itemXml, 'title'));
        const content = sanitizeFeedText(getTagValue(itemXml, 'description')) || title;
        const href = stripTags(getTagValue(itemXml, 'link'));
        const timestamp = stripTags(getTagValue(itemXml, 'pubDate')) || new Date(Date.now() - index * 600000).toISOString();
        const combined = `${title} ${content}`.trim();

        if (!isTopical(combined)) return null;

        return {
          id: `${feed.id}:${href || title || index}`,
          source: 'rss',
          sourceLabel: feed.sourceLabel,
          title,
          href,
          author: feed.sourceLabel,
          content,
          timestamp,
        };
      });
    }),
  );

  return settled.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])).filter(Boolean);
};

const dedupeAndSort = (items = []) =>
  items
    .filter((item) => item?.id && item?.content)
    .filter((item) => isTopical(`${item.title || ''} ${item.content || ''}`))
    .reduce((acc, item) => {
      if (acc.some((entry) => entry.id === item.id)) return acc;
      acc.push(item);
      return acc;
    }, [])
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

const getJsonBody = async (resultPromise) => {
  const result = await resultPromise;
  const body = result?.body ? JSON.parse(result.body) : {};
  return body;
};

export const handler = async (event) => {
  try {
    connectLambda(event);
    const store = getStore(storeName);

    const [rssData, discordData, curatedFeedItems, existingArchive] = await Promise.all([
      getJsonBody(rssMediaHandler()),
      getJsonBody(discordFeedHandler()),
      fetchCuratedFeedItems(),
      store.get(archiveKey, { type: 'json' }).catch(() => []),
    ]);

    const latestRss = Array.isArray(rssData.items) ? normalizeRssItems(rssData.items).filter((item) => isTopical(`${item.title} ${item.content}`)) : [];
    const latestDiscord = Array.isArray(discordData.feed) ? normalizeDiscordItems(discordData.feed) : [];
    const mergedArchive = dedupeAndSort([
      ...(Array.isArray(existingArchive) ? existingArchive : []),
      ...curatedFeedItems,
      ...latestRss,
      ...latestDiscord,
    ]).slice(0, maxArchiveEntries);

    await store.setJSON(archiveKey, mergedArchive);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        latest: {
          rss: [...curatedFeedItems.slice(0, perSourceLimit), ...latestRss].slice(0, perSourceLimit * 2),
          discord: latestDiscord,
        },
        archive: mergedArchive,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown archive error',
        latest: {
          rss: [],
          discord: [],
        },
        archive: [],
      }),
    };
  }
};
