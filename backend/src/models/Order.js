const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'ArtisanProfile', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ artisanId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
