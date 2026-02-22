const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  updateAssignmentStatus
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");


// Create assignment (staff only)
router.post("/", protect, createAssignment);

// Get all assignments (logged-in users)
router.get("/", protect, getAssignments);

// Update status (staff only)
router.patch("/:id/status", protect, updateAssignmentStatus);

module.exports = router;