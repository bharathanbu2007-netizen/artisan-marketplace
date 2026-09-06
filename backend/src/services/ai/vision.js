/**
 * Vision AI service — product detection from an uploaded photo.
 *
 * Uses Google Gemini's vision-capable model (gemini-2.0-flash) via
 * env.AI_API_KEY. Get a free key at https://aistudio.google.com/apikey
 *
 * Falls back to mock data if AI_API_KEY isn't set or the API call fails,
 * so the app keeps working during setup/testing.
 */
const env = require('../../config/env');

const MOCK_PRODUCT_RESULT = {
  detectedObject: 'handcrafted item',
  colors: ['#8B5E3C', '#D9C7A3'],
  material: 'terracotta',
  background: 'plain surface',
  confidence: 0.5,
  mock: true,
};

const MOCK_SCENE_RESULT = {
  surface: 'wooden table',
  lighting: 'natural daylight',
  dominantColors: ['#F5E9DA', '#3B2F2F'],
  recommendedCategory: 'home decor',
  recommendedBackground: 'Studio',
  mock: true,
};

async function fetchImageAsBase64(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const buffer = await res.arrayBuffer();
  return { base64: Buffer.from(buffer).toString('base64'), mimeType: contentType };
}

async function callGeminiVision(imageUrl, prompt) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.AI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64 } }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

async function detectProduct(imageUrl) {
  if (!env.AI_API_KEY) return MOCK_PRODUCT_RESULT;

  const prompt = `You are analyzing a photo of a handmade artisan product for an e-commerce catalog.
Respond ONLY with valid JSON (no markdown fences, no explanation) in exactly this shape:
{"detectedObject": "short name of the item", "colors": ["#hex1", "#hex2"], "material": "primary material", "background": "description of the current background", "confidence": 0.0}`;

  try {
    return await callGeminiVision(imageUrl, prompt);
  } catch (err) {
    console.error('[ai/vision] detectProduct failed, using fallback:', err.message);
    return MOCK_PRODUCT_RESULT;
  }
}

async function analyzeScene(imageUrl) {
  if (!env.AI_API_KEY) return MOCK_SCENE_RESULT;

  const prompt = `You are analyzing a photo of a physical scene (table, shelf, or room) where a handmade product photo will be staged.
Respond ONLY with valid JSON (no markdown fences, no explanation) in exactly this shape:
{"surface": "...", "lighting": "...", "dominantColors": ["#hex1", "#hex2"], "recommendedCategory": "...", "recommendedBackground": "..."}`;

  try {
    return await callGeminiVision(imageUrl, prompt);
  } catch (err) {
    console.error('[ai/vision] analyzeScene failed, using fallback:', err.message);
    return MOCK_SCENE_RESULT;
  }
}

module.exports = { detectProduct, analyzeScene };
