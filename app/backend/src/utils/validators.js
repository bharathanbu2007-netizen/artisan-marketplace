const { body, validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

const phoneValidator = body('phone')
  .matches(/^\+?[0-9]{10,13}$/)
  .withMessage('Enter a valid phone number');

const otpValidator = body('otp')
  .isLength({ min: 4, max: 6 })
  .withMessage('Enter a valid OTP');

const registerValidators = [
  phoneValidator,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').isIn(['buyer', 'seller']).withMessage('Role must be buyer or seller'),
  body('preferredLanguage').isIn(['en', 'hi', 'ta']).withMessage('Unsupported language'),
];

const productValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

module.exports = {
  handleValidation,
  phoneValidator,
  otpValidator,
  registerValidators,
  productValidators,
};
