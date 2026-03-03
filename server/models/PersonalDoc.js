const mongoose = require("mongoose");

const personalDocSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    file: {
      type: String,
      required: [true, "File path is required"]
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isPrivate: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PersonalDoc", personalDocSchema);
