const PersonalDoc = require("../models/PersonalDoc");

// @desc   Upload a personal document
// @route  POST /api/personal-docs
// @access Logged-in users only
exports.uploadDoc = async (req, res) => {
    try {
        const { title, description, isPrivate } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const doc = await PersonalDoc.create({
            title,
            description: description || "",
            file: req.file.path,
            owner: req.user._id,
            isPrivate: isPrivate !== undefined ? isPrivate : true
        });

        return res.status(201).json({
            message: "Document uploaded successfully",
            doc
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// @desc   Get all personal docs of the logged-in user
// @route  GET /api/personal-docs
// @access Logged-in users only
exports.getMyDocs = async (req, res) => {
    try {
        const docs = await PersonalDoc.find({ owner: req.user._id }).sort({
            createdAt: -1
        });

        return res.status(200).json(docs);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// @desc   Get a single personal document by ID
// @route  GET /api/personal-docs/:id
// @access Owner only
exports.getDocById = async (req, res) => {
    try {
        const doc = await PersonalDoc.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Only the owner can view their private document
        if (doc.isPrivate && doc.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json(doc);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// @desc   Delete a personal document
// @route  DELETE /api/personal-docs/:id
// @access Owner only
exports.deleteDoc = async (req, res) => {
    try {
        const doc = await PersonalDoc.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (doc.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied. You are not the owner." });
        }

        await doc.deleteOne();

        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
