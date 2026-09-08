const cloudinary = require('cloudinary').v2;
const env = require('./env');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 or file-path image/audio to Cloudinary under the artisan-marketplace folder.
 * resourceType: 'image' (default) or 'video' — Cloudinary treats audio files under 'video'.
 */
async function uploadImage(filePathOrBase64, folder = 'artisan-marketplace/products', resourceType = 'image') {
  const result = await cloudinary.uploader.upload(filePathOrBase64, {
    folder,
    resource_type: resourceType,
  });
  return { url: result.secure_url, publicId: result.public_id };
}

async function deleteImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, uploadImage, deleteImage };
