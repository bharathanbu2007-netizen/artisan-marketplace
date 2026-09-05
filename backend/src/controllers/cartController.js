const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  return success(res, { cart });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.productId.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  return success(res, { cart }, 'Added to cart');
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { items: { productId: req.params.productId } } },
    { new: true }
  );
  return success(res, { cart }, 'Removed from cart');
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }, { new: true });
  return success(res, { cart }, 'Cart cleared');
});

module.exports = { getCart, addToCart, removeFromCart, clearCart };
