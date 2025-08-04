const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ExcelData = require('../models/excelData.model'); // Import ExcelData
const auth = require('../middleware/auth.middleware');

// --- REGISTER (No changes) ---
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ msg: 'Please enter all fields.' });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User with this email already exists.' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- FINAL, OPTIMIZED LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

        const files = await ExcelData.find({ userId: user._id }).sort({ createdAt: -1 });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
            files: files
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTE (No changes) ---
router.get('/admin/users', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (user.role !== 'admin') return res.status(403).json({ msg: "Access denied." });
        const allUsers = await User.find().select('-password');
        res.json(allUsers);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;