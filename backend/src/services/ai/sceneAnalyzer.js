const { analyzeScene } = require('./vision');

/**
 * Given a scene photo, recommend which of the artisan's products would suit
 * that environment, and how to place/background it (AI Scene Scan mode).
 */
async function recommendPlacement(imageUrl) {
  const scene = await analyzeScene(imageUrl);
  return {
    ...scene,
    suggestion: `This ${scene.surface} with ${scene.lighting} works well for ${scene.recommendedCategory} products, shown against a ${scene.recommendedBackground} background.`,
  };
}

module.exports = { recommendPlacement };
