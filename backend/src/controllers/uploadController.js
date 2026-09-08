const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const { uploadImage } = require('../config/cloudinary');

// POST /api/upload  (multipart/form-data, field name: "image" — accepts images or audio)
const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return failure(res, 'No file provided', 422);
  }

  const isAudio = req.file.mimetype.startsWith('audio/');
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const folder = isAudio ? 'artisan-marketplace/voice-notes' : 'artisan-marketplace/uploads';
  const { url, publicId } = await uploadImage(base64, folder, isAudio ? 'video' : 'image');

  return success(res, { url, publicId });
});

module.exports = { uploadPhoto };
