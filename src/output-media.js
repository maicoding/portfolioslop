const imageModules = import.meta.glob('./assets/output/images/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default'
});

const screenshotModules = import.meta.glob('./assets/output/screenshots/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default'
});

const videoModules = import.meta.glob('./assets/output/videos/*.{mp4,webm,ogg,mov,m4v}', {
  eager: true,
  import: 'default'
});

const imageUrls = Object.values(imageModules);
const screenshotUrls = Object.values(screenshotModules);
const videoUrls = Object.values(videoModules);

function getRandomItem(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomOutputImageUrl() {
  return getRandomItem(imageUrls);
}

export function getRandomOutputVideoUrl() {
  return getRandomItem(videoUrls);
}

export function getRandomOutputScreenshotUrl() {
  return getRandomItem(screenshotUrls);
}

export function getOutputMediaStats() {
  return {
    images: imageUrls.length,
    screenshots: screenshotUrls.length,
    videos: videoUrls.length
  };
}
