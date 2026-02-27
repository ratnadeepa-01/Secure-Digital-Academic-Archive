const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../upload");

const {
  submitAssignment,
  reviewSubmission,
  getMySubmissions,
  getSubmissionsByAssignment
} = require("../controllers/submissionController");

// 🔹 STUDENT - Get my submissions
router.get("/my", protect, authorize("student"), getMySubmissions);

// 🔹 STAFF - Get submissions for specific assignment
router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("staff"),
  getSubmissionsByAssignment
);

// 🔹 STUDENT - Submit assignment
router.post(
  "/:assignmentId",
  protect,
  authorize("student"),
  upload.single("file"),
  submitAssignment
);

// 🔹 STAFF - Approve / Reject
router.patch(
  "/:id",
  protect,
  authorize("staff"),
  reviewSubmission
);

module.exports = router;