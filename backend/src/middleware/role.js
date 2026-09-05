const { failure } = require('../utils/apiResponse');

// Usage: authorize('artisan', 'admin')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return failure(res, 'Forbidden: insufficient role', 403);
  }
  next();
};

module.exports = { authorize };
