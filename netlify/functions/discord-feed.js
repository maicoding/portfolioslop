const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=120',
};

const extractFirstUrl = (value = '') => String(value).match(/https?:\/\/\S+/i)?.[0] || '';

const sanitizeMessageText = (value = '') =>
  String(value)
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const serializeMessage = (message) => {
  const attachmentLine = message.attachments?.[0]?.url || '';
  const embedLine = message.embeds?.[0]?.url || message.embeds?.[0]?.title || '';
  const content = [message.content, attachmentLine, embedLine].filter(Boolean).join(' ').trim();

  return {
    id: message.id,
    content: sanitizeMessageText(content),
    href: extractFirstUrl(content),
    author: message.author?.username || 'discord',
    timestamp: message.timestamp,
  };
};

export const handler = async () => {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;
  const limit = Math.max(5, Number.parseInt(process.env.DISCORD_FEED_LIMIT || '5', 10));

  if (!token || !channelId) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'misconfigured',
        error: 'Missing DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID',
        feed: [],
      }),
    };
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=${limit}`, {
      headers: {
        Authorization: `Bot ${token}`,
        'User-Agent': 'portfolio-discord-feed/2.0',
      },
    });

    const text = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: `Discord API returned ${response.status}`,
          response: text,
          feed: [],
        }),
      };
    }

    const parsed = JSON.parse(text);
    const feed = Array.isArray(parsed)
      ? parsed
          .filter((message) => !message.type || message.type === 0)
          .map(serializeMessage)
          .filter((message) => message.content)
      : [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        feed,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown Discord fetch error',
        feed: [],
      }),
    };
  }
};
