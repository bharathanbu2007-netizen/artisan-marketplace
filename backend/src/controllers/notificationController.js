const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  return success(res, { notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );
  return success(res, { notification }, 'Marked as read');
});

module.exports = { listNotifications, markRead };
