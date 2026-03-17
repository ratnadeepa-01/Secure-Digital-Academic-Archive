const Notification = require("../models/Notification");

// @desc Get all notifications for logged-in user
// @route GET /api/notifications
// @access Protected
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Optional: limits the returned notifications

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark a single notification or all as read
// @route PATCH /api/notifications/:id/read   OR   PATCH /api/notifications/read-all
// @access Protected
exports.markAsRead = async (req, res) => {
  try {
    if (req.params.id === "all") {
      await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
      return res.status(200).json({ message: "All notifications marked as read" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
