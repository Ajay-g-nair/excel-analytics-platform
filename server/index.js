// This line imports the express package
const express = require('express');

// This line imports the mongoose package to connect to MongoDB
const mongoose = require('mongoose');

// This line imports the cors package to allow cross-origin requests
const cors = require('cors');

// This line loads the environment variables from the .env file
require('dotenv').config();

// Create an instance of the express application
const app = express();

// Define the port the server will run on. It will use the PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;


// === MIDDLEWARE ===

// This is the CRUCIAL change for deployment.
// It tells the server to only accept requests from your live Netlify frontend.
app.use(cors({
    origin: "https://sheetsight.netlify.app", // Your Netlify frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true
}));

// This allows your server to understand JSON data in request bodies
app.use(express.json());


// === DATABASE CONNECTION ===
// Get the connection string from your environment variables
const uri = process.env.MONGO_URI;

// Connect to MongoDB using mongoose
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
// Once the connection is open, log a success message
connection.once('open', () => {
  console.log("MongoDB database connection established successfully!");
})


// === A SIMPLE TEST ROUTE ===
// This is a basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Hello! Your Sheetsight backend server is running.');
});


// === ROUTES ===
// This tells the server to use the routes we defined in user.routes.js
const usersRouter = require('./routes/user.routes');
app.use('/api/users', usersRouter); // All user routes will start with /api/users

// This tells the server to use the routes for file handling
const fileRouter = require('./routes/file.routes');
app.use('/api/files', fileRouter); // All file routes will start with /api/files


// === START THE SERVER ===
// This tells the server to start listening for requests on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});