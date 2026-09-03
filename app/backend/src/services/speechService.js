/**
 * Speech-to-text for voice cataloging & voice chat messages.
 * Provider chosen via SPEECH_PROVIDER: mock | google
 * The mock provider is a safe local fallback so uploads still work without keys;
 * swap in Google Cloud Speech-to-Text (or Azure) by implementing the same
 * transcribe(audioFilePath, languageCode) -> string contract.
 */
const fs = require('fs');

async function mockTranscribe(audioFilePath, languageCode) {
  // Dev fallback: cannot actually transcribe without a provider key.
  // Returns a placeholder so downstream cataloging/chat pipelines still run.
  return '[voice message - transcription pending provider setup]';
}

async function transcribeAudio(audioFilePath, languageCode = 'en') {
  const provider = process.env.SPEECH_PROVIDER || 'mock';
  if (!fs.existsSync(audioFilePath)) {
    throw new Error('Audio file not found for transcription');
  }
  if (provider === 'google' && process.env.GOOGLE_SPEECH_API_KEY) {
    // Integration point: call Google Cloud Speech-to-Text REST API here using
    // the audio buffer + languageCode. Left pluggable to avoid bundling a
    // heavy SDK dependency into this scaffold.
    console.warn('[speechService] google provider selected but not yet wired — using mock');
    return mockTranscribe(audioFilePath, languageCode);
  }
  return mockTranscribe(audioFilePath, languageCode);
}

module.exports = { transcribeAudio };
