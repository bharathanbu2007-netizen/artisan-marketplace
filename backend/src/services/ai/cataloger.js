/**
 * Multilingual AI Cataloger — converts a product description into
 * professional, SEO-friendly marketplace content in English + Hindi + Tamil.
 *
 * Catalog generation uses Google Gemini (env.AI_API_KEY) — same key as
 * vision.js. Get one free at https://aistudio.google.com/apikey
 *
 * NOTE: speechToText below is still mocked. Real speech-to-text needs a
 * separate audio-capable provider (e.g. Google Speech-to-Text or Whisper),
 * which takes its own setup — ask if you want that wired in too. For now,
 * the app can generate a full catalog from typed text (the `transcript`
 * field in the request) even without a voice note.
 */
const env = require('../../config/env');

async function speechToText(audioUrl, sourceLanguage = 'ta') {
  // TODO: wire a real speech-to-text provider here.
  return {
    transcript: 'Sample transcribed product description from voice note.',
    detectedLanguage: sourceLanguage,
    mock: true,
  };
}

function fallbackCatalog({ transcript, detectedObject, material }) {
  const title = `Handcrafted ${detectedObject || 'Artisan Product'}`;
  const baseDescription = `A beautifully handcrafted ${material || 'traditional'} piece, made with care by a skilled artisan. ${transcript || ''}`.trim();

  return {
    title,
    description: {
      english: baseDescription,
      hindi: `हस्तनिर्मित ${material || 'पारंपरिक'} उत्पाद। ${transcript || ''}`,
      tamil: `கைவினைப் பொருள் - ${material || 'பாரம்பரிய'}. ${transcript || ''}`,
    },
    category: 'Handicrafts',
    material: material || 'mixed materials',
    craftType: 'traditional handicraft',
    keywords: ['handmade', 'artisan', 'traditional craft', material].filter(Boolean),
    mock: true,
  };
}

async function generateCatalog({ transcript, detectedObject, material }) {
  if (!env.AI_API_KEY) return fallbackCatalog({ transcript, detectedObject, material });

  const prompt = `You are writing SEO-friendly e-commerce marketplace content for a handmade artisan product.
Detected object: ${detectedObject || 'unknown'}
Material: ${material || 'unknown'}
Artisan's own description (may be in a regional Indian language): "${transcript || ''}"

Respond ONLY with valid JSON (no markdown fences, no explanation) in exactly this shape:
{
  "title": "short catchy product title",
  "description": { "english": "...", "hindi": "...", "tamil": "..." },
  "category": "...",
  "material": "...",
  "craftType": "...",
  "keywords": ["...", "..."]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API error (${response.status}): ${await response.text()}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[ai/cataloger] generateCatalog failed, using fallback:', err.message);
    return fallbackCatalog({ transcript, detectedObject, material });
  }
}

module.exports = { speechToText, generateCatalog };
