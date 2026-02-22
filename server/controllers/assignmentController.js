const Assignment = require("../models/Assignment");

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Staff only
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subject, dueDate } = req.body;

    // Only staff can create
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Staff only." });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      dueDate,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Protected
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("createdBy", "name email");

    res.status(200).json(assignments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update assignment status
// @route   PATCH /api/assignments/:id/status
// @access  Staff only
exports.updateAssignmentStatus = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Staff only." });
    }

    const { status } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      assignment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};