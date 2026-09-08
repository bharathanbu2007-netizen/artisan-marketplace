/**
 * Multilingual AI Cataloger — converts a product description into
 * professional, SEO-friendly marketplace content in English + Hindi + Tamil.
 *
 * Catalog generation and speech-to-text both use Google Gemini
 * (env.AI_API_KEY) — same key, Gemini 2.0 Flash supports both text/vision
 * and audio input. Get one free at https://aistudio.google.com/apikey
 *
 * Both fall back to mock data if AI_API_KEY isn't set or the call fails,
 * so the app keeps working during setup/testing.
 */
const env = require('../../config/env');

async function speechToText(audioUrl, sourceLanguage = 'ta') {
  if (!env.AI_API_KEY) {
    return {
      transcript: 'Sample transcribed product description from voice note.',
      detectedLanguage: sourceLanguage,
      mock: true,
    };
  }

  const langNames = { en: 'English', hi: 'Hindi', ta: 'Tamil' };
  const langName = langNames[sourceLanguage] || sourceLanguage;

  try {
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error(`Failed to fetch audio (${res.status})`);
    const contentType = res.headers.get('content-type') || 'audio/mp4';
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    const prompt = `This is a voice note from an artisan describing a handmade product, spoken in ${langName}. Transcribe it, then translate the transcript to English if it isn't already in English.
Respond ONLY with valid JSON (no markdown fences, no explanation) in exactly this shape:
{"transcript": "the English translation of what was said", "originalTranscript": "the transcript in the original spoken language"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: contentType, data: base64 } }] }],
          generationConfig: { temperature: 0.2 },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API error (${response.status}): ${await response.text()}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return { transcript: parsed.transcript, originalTranscript: parsed.originalTranscript, detectedLanguage: sourceLanguage };
  } catch (err) {
    console.error('[ai/cataloger] speechToText failed, using fallback:', err.message);
    return {
      transcript: 'Sample transcribed product description from voice note.',
      detectedLanguage: sourceLanguage,
      mock: true,
    };
  }
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
