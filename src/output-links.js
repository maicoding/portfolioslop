export const outputLinksById = {
  'midjourney-fashion': [],
  'midjourney-architecture': [],
  'midjourney-creatures': []
};

export function getRandomOutputLink(id) {
  const links = outputLinksById[id] || [];
  if (!links.length) return null;

  const index = Math.floor(Math.random() * links.length);
  return links[index];
}
