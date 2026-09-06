const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const { uploadImage } = require('../config/cloudinary');

// POST /api/upload  (multipart/form-data, field name: "image")
const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return failure(res, 'No image file provided', 422);
  }

  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const { url, publicId } = await uploadImage(base64, 'artisan-marketplace/uploads');

  return success(res, { url, publicId });
});

module.exports = { uploadPhoto };
