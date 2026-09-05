require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/artisan-marketplace',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  AI_API_KEY: process.env.AI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MOBILE_URL: process.env.MOBILE_URL || 'http://localhost:8081',
};

module.exports = env;
