/**
 * Smart cataloging pipeline: turns a seller's spoken description (any of
 * en/hi/ta) into structured, multilingual product listing fields.
 */
const { transcribeAudio } = require('./speechService');
const { translateToAllLanguages } = require('./translationService');

/**
 * @param {string} audioFilePath - path to uploaded voice note describing the product
 * @param {string} spokenLanguage - language the seller spoke in ('en'|'hi'|'ta')
 */
async function catalogFromVoice(audioFilePath, spokenLanguage = 'en') {
  const transcript = await transcribeAudio(audioFilePath, spokenLanguage);

  // Very lightweight heuristic split: first sentence/phrase -> title,
  // remainder -> description. A real NLP step could replace this later
  // without changing the function's contract.
  const [firstPart, ...rest] = transcript.split(/[.!\n]/).map((s) => s.trim()).filter(Boolean);
  const title = firstPart || transcript.slice(0, 60);
  const description = rest.join('. ') || transcript;

  const titleTranslations = await translateToAllLanguages(title, spokenLanguage);
  const descriptionTranslations = await translateToAllLanguages(description, spokenLanguage);

  const translations = {};
  for (const lang of ['en', 'hi', 'ta']) {
    translations[lang] = {
      title: titleTranslations[lang],
      description: descriptionTranslations[lang],
    };
  }

  return { transcript, title, description, translations };
}

module.exports = { catalogFromVoice };
