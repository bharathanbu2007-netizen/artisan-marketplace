// Standalone Cloudinary credential test — run with: node test-cloudinary.js
// Reads backend/.env directly and attempts a real upload, so we can tell
// whether the credentials themselves are wrong, or whether it's just that
// Render hasn't picked up the latest value yet.
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API key:', process.env.CLOUDINARY_API_KEY);
console.log('API secret length:', process.env.CLOUDINARY_API_SECRET?.length, '(should be 27 for most Cloudinary secrets)');
console.log('API secret has leading/trailing whitespace:', process.env.CLOUDINARY_API_SECRET !== process.env.CLOUDINARY_API_SECRET?.trim());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload(
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  { folder: 'artisan-marketplace/uploads-test' },
  (err, result) => {
    if (err) {
      console.log('\n❌ FAILED:', err.message);
    } else {
      console.log('\n✅ SUCCESS! Uploaded to:', result.secure_url);
    }
  }
);
