const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const AiGeneration = require('../models/AiGeneration');
const ArtisanProfile = require('../models/ArtisanProfile');
const vision = require('../services/ai/vision');
const cataloger = require('../services/ai/cataloger');
const pricing = require('../services/ai/pricing');
const sceneAnalyzer = require('../services/ai/sceneAnalyzer');
const { applyBackground, BACKGROUND_OPTIONS } = require('../services/image/background');

// POST /api/ai/analyze-product  { imageUrl }
const analyzeProduct = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  const result = await vision.detectProduct(imageUrl);

  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  if (artisan) await AiGeneration.create({ artisanId: artisan._id, type: 'vision', input: { imageUrl }, output: result });

  return success(res, { analysis: result });
});

// POST /api/ai/enhance-image  { imageUrl, background }
const enhanceImage = asyncHandler(async (req, res) => {
  const { imageUrl, background = 'AI Recommended' } = req.body;
  const result = applyBackground(imageUrl, background);
  return success(res, { enhancement: result, options: BACKGROUND_OPTIONS });
});

// POST /api/ai/analyze-scene  { imageUrl }
const analyzeScene = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  const result = await sceneAnalyzer.recommendPlacement(imageUrl);
  return success(res, { scene: result });
});

// POST /api/ai/catalog  { audioUrl, sourceLanguage, detectedObject, material }
const generateCatalog = asyncHandler(async (req, res) => {
  const { audioUrl, sourceLanguage = 'ta', detectedObject, material } = req.body;
  const speech = audioUrl ? await cataloger.speechToText(audioUrl, sourceLanguage) : { transcript: req.body.transcript || '' };
  const catalog = await cataloger.generateCatalog({ transcript: speech.transcript, detectedObject, material });

  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  if (artisan) await AiGeneration.create({ artisanId: artisan._id, type: 'catalog', input: req.body, output: catalog });

  return success(res, { catalog, transcript: speech.transcript });
});

// POST /api/ai/price  { category, material, rawMaterialEstimate, comparableProducts }
const suggestPrice = asyncHandler(async (req, res) => {
  const result = await pricing.suggestPrice(req.body);

  const artisan = await ArtisanProfile.findOne({ userId: req.user._id });
  if (artisan) await AiGeneration.create({ artisanId: artisan._id, type: 'pricing', input: req.body, output: result });

  return success(res, { pricing: result });
});

module.exports = { analyzeProduct, enhanceImage, analyzeScene, generateCatalog, suggestPrice };
