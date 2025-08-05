const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
// Use a more flexible CORS policy for the final version
app.use(cors());
app.use(express.json());

// === DATABASE CONNECTION ===
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully!");
});

// === ROUTES ===
app.get('/', (req, res) => res.send('Sheetsight backend is running.'));
const usersRouter = require('./routes/user.routes');
app.use('/api/users', usersRouter);
const fileRouter = require('./routes/file.routes');
app.use('/api/files', fileRouter);

// === START THE SERVER ===
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});