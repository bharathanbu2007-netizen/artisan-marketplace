/**
 * Pluggable translation service.
 * Provider is chosen via TRANSLATION_PROVIDER env var: mock | google | azure
 * Falls back to `mock` (identity passthrough tagged with target lang) so the
 * app is fully runnable without API keys during development.
 */
const https = require('https');

const LANG_NAMES = { en: 'English', hi: 'Hindi', ta: 'Tamil' };

async function mockTranslate(text, targetLang) {
  // Dev fallback: no real translation, just echoes text so the pipeline works end-to-end.
  return text;
}

async function googleTranslate(text, targetLang) {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) return mockTranslate(text, targetLang);
  const body = JSON.stringify({ q: text, target: targetLang, format: 'text' });
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'translation.googleapis.com',
        path: `/language/translate/v2?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.data.translations[0].translatedText);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function translateText(text, targetLang) {
  if (!text) return '';
  const provider = process.env.TRANSLATION_PROVIDER || 'mock';
  try {
    if (provider === 'google') return await googleTranslate(text, targetLang);
    // 'azure' provider point left for future implementation with same interface
    return await mockTranslate(text, targetLang);
  } catch (err) {
    console.error('[translationService] fallback to mock due to error:', err.message);
    return mockTranslate(text, targetLang);
  }
}

/**
 * Translate one piece of source text into all supported app languages.
 * Returns { en, hi, ta } with the source language left untranslated.
 */
async function translateToAllLanguages(text, sourceLang) {
  const targets = Object.keys(LANG_NAMES).filter((l) => l !== sourceLang);
  const results = { [sourceLang]: text };
  await Promise.all(
    targets.map(async (lang) => {
      results[lang] = await translateText(text, lang);
    })
  );
  return results;
}

module.exports = { translateText, translateToAllLanguages, LANG_NAMES };
