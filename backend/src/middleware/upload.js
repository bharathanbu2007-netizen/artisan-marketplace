const multer = require('multer');

// Store the uploaded file in memory as a Buffer (no local disk writes needed —
// works cleanly on Render's ephemeral filesystem). We then base64-encode it
// and hand it to Cloudinary in the controller.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max (covers short voice notes too)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only image or audio files are allowed'));
    }
    cb(null, true);
  },
});

module.exports = upload;
