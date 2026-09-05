/**
 * Vision AI service — product detection from an uploaded photo.
 *
 * Replace the mocked logic below with a real call to your chosen vision
 * provider (e.g. Google Vision, AWS Rekognition, or a custom model) using
 * env.AI_API_KEY. The function signature is the contract the rest of the
 * app depends on — keep the return shape stable.
 */
async function detectProduct(imageUrl) {
  // TODO: call real vision API here.
  return {
    detectedObject: 'handcrafted item',
    colors: ['#8B5E3C', '#D9C7A3'],
    material: 'terracotta',
    background: 'plain surface',
    confidence: 0.87,
  };
}

/**
 * Analyze a physical scene (room/table/shop shelf) and suggest suitable
 * product categories and placement/background.
 */
async function analyzeScene(imageUrl) {
  // TODO: call real vision API here.
  return {
    surface: 'wooden table',
    lighting: 'natural daylight',
    dominantColors: ['#F5E9DA', '#3B2F2F'],
    recommendedCategory: 'home decor',
    recommendedBackground: 'Studio',
  };
}

module.exports = { detectProduct, analyzeScene };
