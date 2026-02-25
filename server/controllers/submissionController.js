const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");

// @desc Student submit assignment
// @route POST /api/submissions/:assignmentId
// @access Student only
exports.submitAssignment = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit assignments" });
    }

    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const submission = await Submission.create({
      assignment: assignment._id,
      student: req.user._id,
      file: req.file.path
    });

    return res.status(201).json({
      message: "Assignment submitted successfully",
      submission
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// @desc Staff approve/reject submission
// @route PATCH /api/submissions/:id
// @access Staff only
exports.reviewSubmission = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Only staff can review submissions" });
    }

    const { status, remarks } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.status = status;
    submission.remarks = remarks || "";

    await submission.save();

    return res.json({
      message: "Submission updated",
      submission
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// @desc Student view their submissions
// @route GET /api/submissions/my
// @access Student only
exports.getMySubmissions = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view their submissions" });
    }

    const submissions = await Submission.find({ student: req.user._id })
      .populate("assignment", "title subject dueDate");

    return res.json(submissions);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};