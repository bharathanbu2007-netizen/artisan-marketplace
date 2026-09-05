const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    lastMessage: String,
    lastMessageAt: Date,
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
