const mongoose = require('mongoose');

const aiGenerationSchema = new mongoose.Schema(
  {
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtisanProfile', required: true },
    type: { type: String, enum: ['vision', 'catalog', 'pricing', 'scene'], required: true },
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiGeneration', aiGenerationSchema);
