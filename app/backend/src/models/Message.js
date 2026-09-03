const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['text', 'voice'], default: 'text' },
    // Original message as authored by sender, in sender's language
    originalText: { type: String },
    originalLanguage: { type: String, enum: ['en', 'hi', 'ta'] },
    // Voice message
    audioUrl: { type: String },
    transcript: { type: String },
    // Auto-translated text, keyed by language code, so recipient always reads in their language
    translations: {
      en: { type: String },
      hi: { type: String },
      ta: { type: String },
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
