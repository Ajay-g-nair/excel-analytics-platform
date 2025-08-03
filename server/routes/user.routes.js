const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let User = require('../models/user.model'); // We need the User blueprint

// --- REGISTER A NEW USER ---
// This handles POST requests to http://localhost:5000/api/users/register
router.route('/register').post(async (req, res) => {
    try {
        // Get username, email, and password from the request body
        const { username, email, password } = req.body;

        // --- Validation ---
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // --- Hash the Password ---
        // We never store plain text passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Create and Save the New User ---
        const newUser = new User({
            username,
            email,
            password: hashedPassword // Save the hashed password, not the original
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // Send back the new user data (without password)

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- LOGIN A USER ---
// This handles POST requests to http://localhost:5000/api/users/login
router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- Validation ---
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        // --- Check for existing user ---
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials. User does not exist.' });
        }

        // --- Validate password ---
        // Compare the password from the request with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials. Incorrect password.' });
        }

        // --- Create and send a JSON Web Token (JWT) ---
        // This token is proof that the user is logged in
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // --- Send the successful response ---
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Make the router available for other files to use
module.exports = router;