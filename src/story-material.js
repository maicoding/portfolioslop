const storyMaterialModules = import.meta.glob(
  './assets/story-material/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  {
    eager: true,
    import: 'default',
  },
);

const storyMaterialUrls = Object.values(storyMaterialModules);

export function getStoryMaterialUrls() {
  return [...storyMaterialUrls];
}

export function getStoryMaterialStats() {
  return {
    items: storyMaterialUrls.length,
  };
}
