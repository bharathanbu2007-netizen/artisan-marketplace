/**
 * Multilingual AI Cataloger — converts a regional-language voice note into
 * professional, SEO-friendly marketplace content in English + Hindi + Tamil.
 *
 * Pipeline: speech-to-text -> product info extraction -> translation ->
 * professional description generation. Swap the mocked steps for a real
 * speech-to-text + LLM translation/generation provider.
 */
async function speechToText(audioUrl, sourceLanguage = 'ta') {
  // TODO: call a real speech-to-text provider.
  return {
    transcript: 'Sample transcribed product description from voice note.',
    detectedLanguage: sourceLanguage,
  };
}

async function generateCatalog({ transcript, detectedObject, material }) {
  // TODO: call a real LLM/translation provider using env.AI_API_KEY.
  const title = `Handcrafted ${detectedObject || 'Artisan Product'}`;
  const baseDescription = `A beautifully handcrafted ${material || 'traditional'} piece, made with care by a skilled artisan. ${transcript}`.trim();

  return {
    title,
    description: {
      english: baseDescription,
      hindi: `हस्तनिर्मित ${material || 'पारंपरिक'} उत्पाद। ${transcript}`,
      tamil: `கைவினைப் பொருள் - ${material || 'பாரம்பரிய'}. ${transcript}`,
    },
    category: 'Handicrafts',
    material: material || 'mixed materials',
    craftType: 'traditional handicraft',
    keywords: ['handmade', 'artisan', 'traditional craft', material].filter(Boolean),
  };
}

module.exports = { speechToText, generateCatalog };
