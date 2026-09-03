const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/buyer/cart  { productId, quantity }
async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) cart = await Cart.create({ buyer: req.user._id, items: [] });

    const existing = cart.items.find((i) => String(i.product) === productId);
    if (existing) existing.quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity, priceAtAdd: product.price });

    await cart.save();
    return res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
}

// GET /api/buyer/cart
async function getCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
    return res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) {
    next(err);
  }
}

// POST /api/buyer/orders  { shippingAddress } - checkout current cart, split by seller
async function placeOrder(req, res, next) {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ success: false, message: 'Cart is empty' });

    const bySeller = {};
    for (const item of cart.items) {
      const sellerId = String(item.product.seller);
      if (!bySeller[sellerId]) bySeller[sellerId] = [];
      bySeller[sellerId].push(item);
    }

    const orders = [];
    for (const [sellerId, items] of Object.entries(bySeller)) {
      const totalAmount = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
      const order = await Order.create({
        buyer: req.user._id,
        seller: sellerId,
        items: items.map((i) => ({ product: i.product._id, title: i.product.title, quantity: i.quantity, price: i.priceAtAdd })),
        totalAmount,
        shippingAddress: req.body.shippingAddress,
      });
      orders.push(order);
    }

    cart.items = [];
    await cart.save();

    return res.status(201).json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

// GET /api/buyer/orders
async function myOrdersAsBuyer(req, res, next) {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

// GET /api/seller/orders
async function myOrdersAsSeller(req, res, next) {
  try {
    const orders = await Order.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/seller/orders/:id/status  { status }
async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, seller: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = { addToCart, getCart, placeOrder, myOrdersAsBuyer, myOrdersAsSeller, updateOrderStatus };
