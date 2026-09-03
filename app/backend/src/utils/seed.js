/**
 * Seeds a demo admin user so /api/admin routes are reachable immediately
 * after a fresh install. Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

async function seed() {
  await connectDB();
  const existing = await User.findOne({ phone: '+910000000000' });
  if (!existing) {
    await User.create({
      phone: '+910000000000',
      name: 'Admin',
      role: 'admin',
      preferredLanguage: 'en',
      isVerified: true,
    });
    console.log('[seed] created default admin (+910000000000)');
  } else {
    console.log('[seed] admin already exists');
  }
  await mongoose.disconnect();
}

seed();
