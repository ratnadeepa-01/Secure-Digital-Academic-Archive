const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../upload");

const {
  submitAssignment,
  reviewSubmission,
  getMySubmissions
} = require("../controllers/submissionController");

router.post("/:assignmentId", protect, upload.single("file"), submitAssignment);

router.patch("/:id", protect, reviewSubmission);

router.get("/my", protect, getMySubmissions);

module.exports = router;