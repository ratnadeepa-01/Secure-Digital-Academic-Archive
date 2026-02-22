const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Assignment description is required"]
    },

    subject: {
      type: String,
      required: [true, "Subject is required"]
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    },

    status: {
      type: String,
      enum: ["CREATED", "PUBLISHED", "CLOSED"],
      default: "CREATED"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);