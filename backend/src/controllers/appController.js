const AppVersion = require('../models/AppVersion');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

// GET /api/app/version?platform=android
const getVersion = asyncHandler(async (req, res) => {
  const { platform = 'android' } = req.query;
  const version = await AppVersion.findOne({ platform }).sort({ createdAt: -1 });
  return success(res, {
    version: version || {
      platform,
      latestVersion: '1.0.0',
      minimumVersion: '1.0.0',
      forceUpdate: false,
      releaseNotes: ['Initial release'],
    },
  });
});

const setVersion = asyncHandler(async (req, res) => {
  const version = await AppVersion.create(req.body);
  return success(res, { version }, 'Version published', 201);
});

module.exports = { getVersion, setVersion };
