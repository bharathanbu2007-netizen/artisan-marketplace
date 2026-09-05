const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['text', 'image', 'product', 'voice'], default: 'text' },
    text: String,
    attachments: [{ url: String, publicId: String, kind: String }],
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
