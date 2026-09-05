const { buildEnhancementTransform } = require('./enhancer');

const BACKGROUND_OPTIONS = ['Original', 'White', 'Beige', 'Studio', 'Transparent', 'AI Recommended'];

function applyBackground(imageUrl, background) {
  if (!BACKGROUND_OPTIONS.includes(background)) {
    background = 'AI Recommended';
  }
  const transform = buildEnhancementTransform({ background });
  // In production: build a Cloudinary delivery URL with these transformations
  // inserted into imageUrl, or call cloudinary.url() with the transformation array.
  return { imageUrl, ...transform };
}

module.exports = { BACKGROUND_OPTIONS, applyBackground };
