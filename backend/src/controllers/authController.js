const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = 'buyer', businessName, craftType } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return failure(res, 'Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash, role });

  if (role === 'artisan') {
    await ArtisanProfile.create({
      userId: user._id,
      businessName: businessName || name,
      craftType: craftType || 'general',
    });
  }

  const token = generateToken(user._id, user.role);
  return success(
    res,
    { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    'Registered successfully',
    201
  );
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return failure(res, 'Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return failure(res, 'Invalid credentials', 401);

  if (!user.isActive) return failure(res, 'Account is deactivated', 403);

  const token = generateToken(user._id, user.role);
  return success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Logged in');
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  return success(res, { user: req.user });
});

module.exports = { register, login, me };
