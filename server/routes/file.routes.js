const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const auth = require('../middleware/auth.middleware');
const ExcelData = require('../models/excelData.model');
const User = require('../models/user.model'); // 1. We need the User model to check the role

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Regular user 'upload' route (No changes) ---
router.post('/upload', auth, async (req, res) => { /* ... full upload code ... */ });

// --- Regular user 'my-files' route (No changes) ---
router.get('/my-files', auth, async (req, res) => { /* ... full my-files code ... */ });


// --- NEW ADMIN ROUTE: GET ALL FILES FROM ALL USERS ---
router.get('/admin/all-files', auth, async (req, res) => {
    try {
        // First, check if the person making the request is an admin
        const user = await User.findById(req.user);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied. Not an admin." });
        }

        // This is a powerful MongoDB query that gets all files and
        // attaches the uploader's username to each file.
        const allFiles = await ExcelData.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username'); // This is the magic: it finds the user matching 'userId' and pulls in just their 'username'

        res.json(allFiles);

    } catch (err) {
        console.error("Error fetching all files for admin:", err);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;