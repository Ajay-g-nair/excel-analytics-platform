import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    // If the user IS logged in, redirect them away from the guest page to the dashboard.
    if (token) {
        return <Navigate to="/dashboard" />;
    }
    // If they are not logged in, let them see the page.
    return children;
};

export default GuestRoute;