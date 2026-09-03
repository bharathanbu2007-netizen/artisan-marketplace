const { suggestPrice } = require('../services/pricingService');
const { catalogFromVoice } = require('../services/catalogService');
const { enhanceProductImage } = require('../services/imageService');

// POST /api/ai/pricing/suggest  { category, basePrice, materials }
async function suggestPriceEndpoint(req, res, next) {
  try {
    const { category, basePrice, materials } = req.body;
    const result = await suggestPrice({ category, basePrice: Number(basePrice), materials: materials || [] });
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/catalog/voice  (multipart: voiceNote)  { spokenLanguage }
async function catalogVoiceEndpoint(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'voiceNote file is required' });
    const spokenLanguage = req.body.spokenLanguage || req.user.preferredLanguage || 'en';
    const result = await catalogFromVoice(req.file.path, spokenLanguage);
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/image/enhance  (multipart: image)
async function enhanceImageEndpoint(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'image file is required' });
    const enhancedPath = await enhanceProductImage(req.file.path);
    return res.json({ success: true, enhancedPath });
  } catch (err) {
    next(err);
  }
}

module.exports = { suggestPriceEndpoint, catalogVoiceEndpoint, enhanceImageEndpoint };
