const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- THIS IS THE NEW CONFIGURATION ---
// Increase the limit for JSON bodies and URL-encoded bodies.
// This helps prevent requests from timing out with larger file data.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(cors());

// Database Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!");
});

// Test Route
app.get('/', (req, res) => {
    res.send('Hello! Your MERN stack server is running.');
});

// API Routes
const usersRouter = require('./routes/user.routes');
app.use('/api/users', usersRouter);

const fileRouter = require('./routes/file.routes');
app.use('/api/files', fileRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running successfully on port: ${PORT}`);
});