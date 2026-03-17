const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");

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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const fileData = req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    }));

    let submission = await Submission.findOne({
      assignment: assignment._id,
      student: req.user._id
    });

    if (submission) {
      // Version History logic
      submission.history.push({
        version: submission.version,
        files: submission.files,
        status: submission.status,
        remarks: submission.remarks,
        updatedAt: submission.updatedAt
      });

      submission.version += 1;
      submission.files = fileData;
      submission.status = "PENDING";
      submission.remarks = "";

      await submission.save();
    } else {
      submission = await Submission.create({
        assignment: assignment._id,
        student: req.user._id,
        files: fileData,
        version: 1
      });
    }

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

    // Notify the student about the status update
    await Notification.create({
      recipient: submission.student,
      message: `Your submission for an assignment was marked as ${status}.`,
      type: "GRADING",
      link: `/submission/${submission._id}`
    });

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
    const submissions = await Submission.find({
      student: req.user._id
    }).populate("assignment");

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Student view their submissions
// @route GET /api/submissions/my
// @access Student only
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId
    })
      .populate("student", "name email")
      .populate("assignment", "title");

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Staff get ALL submissions (across all assignments)
// @route GET /api/submissions/all
// @access Staff only
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("student", "name email")
      .populate("assignment", "title subject dueDate")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get a single submission by ID
// @route GET /api/submissions/:id
// @access Protected
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("student", "name email")
      .populate("assignment", "title subject dueDate description");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};