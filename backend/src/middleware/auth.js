const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { failure } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return failure(res, 'Not authorized, no token', 401);
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user || !user.isActive) {
      return failure(res, 'Not authorized, user not found or inactive', 401);
    }
    req.user = user;
    next();
  } catch (err) {
    return failure(res, 'Not authorized, token invalid or expired', 401);
  }
};

module.exports = { protect };
