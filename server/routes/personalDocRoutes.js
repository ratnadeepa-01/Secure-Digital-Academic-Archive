const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../upload");

const {
    uploadDoc,
    getMyDocs,
    getDocById,
    deleteDoc
} = require("../controllers/personalDocController");

// Upload a personal document (file required)
router.post("/", protect, upload.single("file"), uploadDoc);

// Get all documents of the logged-in user
router.get("/", protect, getMyDocs);

// Get a specific document by ID
router.get("/:id", protect, getDocById);

// Delete a document
router.delete("/:id", protect, deleteDoc);

module.exports = router;
