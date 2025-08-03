const jwt = require('jsonwebtoken');

// This is our middleware function (the "security guard")
const auth = (req, res, next) => {
    try {
        // Get the token from the request header
        // The frontend will need to send it in 'x-auth-token'
        const token = req.header('x-auth-token');

        // Check if there is no token
        if (!token) {
            return res.status(401).json({ msg: 'No authentication token, authorization denied.' });
        }

        // Verify the token using our secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is invalid
        if (!verified) {
            return res.status(401).json({ msg: 'Token verification failed, authorization denied.' });
        }

        // If the token is valid, add the user's ID to the request object
        // The 'id' comes from the payload we created when we signed the token in user.routes.js
        req.user = verified.id;

        // Call next() to allow the request to proceed to the actual route handler
        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;