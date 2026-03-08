const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    files: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
      }
    ],

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    remarks: {
      type: String,
      default: ""
    },

    version: {
      type: Number,
      default: 1
    },

    history: [
      {
        version: Number,
        files: [
          {
            filename: String,
            path: String,
            mimetype: String,
            size: Number
          }
        ],
        status: String,
        remarks: String,
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Submission", submissionSchema);