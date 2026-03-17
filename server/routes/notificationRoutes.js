const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getMyNotifications, markAsRead } = require("../controllers/notificationController");

// Get all notifications for the user
router.get("/", protect, getMyNotifications);

// Mark all as read
router.patch("/read-all", protect, async (req, res, next) => {
    req.params.id = "all";
    next();
}, markAsRead);

// Mark single as read
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
