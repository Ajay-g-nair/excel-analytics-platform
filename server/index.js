const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    // --- THIS IS THE ONLY LINE THAT HAS CHANGED ---
    console.log(`Server is running successfully on port: ${PORT}`);
});