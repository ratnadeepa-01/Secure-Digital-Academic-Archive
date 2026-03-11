const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../upload");

const {
  submitAssignment,
  reviewSubmission,
  getMySubmissions,
  getSubmissionsByAssignment,
  getAllSubmissions,
  getSubmissionById
} = require("../controllers/submissionController");
const validate = require("../middleware/validateMiddleware");
const { reviewSubmissionSchema } = require("../utils/validation");

// 🔹 STUDENT - Get my submissions
router.get("/my", protect, authorize("student"), getMySubmissions);

// 🔹 STAFF - Get ALL submissions (across all assignments)
router.get("/all", protect, authorize("staff"), getAllSubmissions);

// 🔹 STAFF - Get submissions for specific assignment
router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("staff"),
  getSubmissionsByAssignment
);

// 🔹 GET single submission by ID
router.get("/:id", protect, getSubmissionById);

// 🔹 STUDENT - Submit assignment
router.post(
  "/:assignmentId",
  protect,
  authorize("student"),
  upload.array("files", 10),
  submitAssignment
);

// 🔹 STAFF - Approve / Reject
router.patch(
  "/:id",
  protect,
  authorize("staff"),
  validate(reviewSubmissionSchema),
  reviewSubmission
);

module.exports = router;