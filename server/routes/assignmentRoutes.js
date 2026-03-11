const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignmentStatus
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createAssignmentSchema, updateAssignmentStatusSchema } = require("../utils/validation");

// Create assignment (staff only)
router.post("/", protect, validate(createAssignmentSchema), createAssignment);

// Get all assignments (logged-in users)
router.get("/", protect, getAssignments);

// Get single assignment by ID
router.get("/:id", protect, getAssignmentById);

// Update status (staff only)
router.patch("/:id/status", protect, validate(updateAssignmentStatusSchema), updateAssignmentStatus);

module.exports = router;