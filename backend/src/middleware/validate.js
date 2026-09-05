const { failure } = require('../utils/apiResponse');

// Simple required-fields validator: validateBody(['email', 'password'])
const validateBody = (fields) => (req, res, next) => {
  const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === '');
  if (missing.length) {
    return failure(res, `Missing required field(s): ${missing.join(', ')}`, 422);
  }
  next();
};

module.exports = { validateBody };
