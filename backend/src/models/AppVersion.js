const mongoose = require('mongoose');

const appVersionSchema = new mongoose.Schema(
  {
    platform: { type: String, enum: ['android', 'ios'], required: true },
    latestVersion: { type: String, required: true },
    minimumVersion: { type: String, required: true },
    updateUrl: String,
    forceUpdate: { type: Boolean, default: false },
    releaseNotes: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AppVersion', appVersionSchema);
