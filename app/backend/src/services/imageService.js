/**
 * AI image enhancement for product photos (lighting/background cleanup).
 * Provider chosen via IMAGE_ENHANCEMENT_PROVIDER: mock | openai | stability
 */
const fs = require('fs');
const path = require('path');

async function mockEnhance(imagePath) {
  // Dev fallback: copy the original image as the "enhanced" version so the
  // rest of the pipeline (upload -> enhance -> store) is exercised end-to-end.
  const dir = path.dirname(imagePath);
  const ext = path.extname(imagePath);
  const base = path.basename(imagePath, ext);
  const outPath = path.join(dir, `${base}-enhanced${ext}`);
  fs.copyFileSync(imagePath, outPath);
  return outPath;
}

async function enhanceProductImage(imagePath) {
  const provider = process.env.IMAGE_ENHANCEMENT_PROVIDER || 'mock';
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    // Integration point: call an image edit/enhance API here.
    console.warn('[imageService] openai provider selected but not yet wired — using mock');
    return mockEnhance(imagePath);
  }
  return mockEnhance(imagePath);
}

module.exports = { enhanceProductImage };
