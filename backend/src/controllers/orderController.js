const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const { notifyUser } = require('../services/notificationService');

// POST /api/orders  — server re-validates price + product ids, never trusts client totals
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body; // items: [{ productId, quantity }]
  if (!items?.length) return failure(res, 'Order must include at least one item', 422);

  const products = await Product.find({ _id: { $in: items.map((i) => i.productId) }, status: 'published' });
  if (products.length !== items.length) return failure(res, 'One or more products are unavailable', 422);

  const artisanId = products[0].artisanId;
  const sameArtisan = products.every((p) => p.artisanId.toString() === artisanId.toString());
  if (!sameArtisan) return failure(res, 'All items in one order must belong to the same artisan', 422);

  let totalAmount = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);
    const price = product.pricing.manufacturerPrice; // server-side authoritative price
    totalAmount += price * item.quantity;
    return { productId: product._id, quantity: item.quantity, price };
  });

  const order = await Order.create({
    buyerId: req.user._id,
    artisanId,
    items: orderItems,
    totalAmount,
    shippingAddress,
  });

  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

  req.app.get('io')?.emit('order:created', { orderId: order._id, artisanId });
  const artisanProfile = await require('../models/ArtisanProfile').findById(artisanId);
  if (artisanProfile) await notifyUser(artisanProfile.userId, { type: 'order:created', title: 'New order received', body: `Order #${order._id}` });

  return success(res, { order }, 'Order placed', 201);
});

// GET /api/orders  — buyer sees own orders, artisan sees orders for their products
const listOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'artisan'
    ? { artisanId: (await require('../models/ArtisanProfile').findOne({ userId: req.user._id }))?._id }
    : { buyerId: req.user._id };

  const orders = await Order.find(filter).populate('items.productId').sort({ createdAt: -1 });
  return success(res, { orders });
});

// GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.productId');
  if (!order) return failure(res, 'Order not found', 404);
  return success(res, { order });
});

// PATCH /api/orders/:id  — status updates (artisan/admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return failure(res, 'Order not found', 404);

  req.app.get('io')?.emit('order:updated', { orderId: order._id, status });
  await notifyUser(order.buyerId, { type: 'order:updated', title: 'Order status updated', body: `Order #${order._id} is now ${status}` });

  return success(res, { order }, 'Order updated');
});

module.exports = { createOrder, listOrders, getOrder, updateOrderStatus };
