const cloudinary = require('cloudinary').v2;
const env = require('./env');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});
console.log(
  `[cloudinary] cloud_name=u5zpkspk api_key=511185895335466 api_secret_length=JfTo2_kS41VUj29kC7v7SwLe9iI

);

/**
 * Upload a base64 or file-path image to Cloudinary under the artisan-marketplace folder.
 */
async function uploadImage(filePathOrBase64, folder = 'artisan-marketplace/products') {
  const result = await cloudinary.uploader.upload(filePathOrBase64, {
    folder,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

async function deleteImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, uploadImage, deleteImage };
