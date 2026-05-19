const aiImageModules = import.meta.glob(
    './assets/ai-images/*.{png,jpg,jpeg,webp,avif,gif,svg}',
    {
        eager: true,
        import: 'default'
    }
);

const aiImageUrls = Object.values(aiImageModules);

export function getAiImageStats() {
    return {
        images: aiImageUrls.length
    };
}

export function getRandomAiImageUrl() {
    if (!aiImageUrls.length) return null;
    return aiImageUrls[Math.floor(Math.random() * aiImageUrls.length)];
}

export function getRandomAiImageSet(count = 1) {
    if (!aiImageUrls.length) return [];

    const shuffled = [...aiImageUrls].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}
