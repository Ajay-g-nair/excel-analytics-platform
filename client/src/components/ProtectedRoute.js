import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the user's token exists in local storage
    const token = localStorage.getItem('token');

    // If there is no token, the user is not logged in.
    // Redirect them to the /login page.
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If there is a token, allow them to see the component they were trying to access.
    return children;
};

export default ProtectedRoute;