import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin'; // 1. We import our new Admin page component.

// The main App component that sets up the Router
const App = () => (<Router><Layout /></Router>);

// The Layout component manages the navigation bar and the main content area
const Layout = () => {
    // We create a piece of state to hold the currently logged-in user's information.
    // It starts as 'null' (no one is logged in).
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // This useEffect hook runs once when the app first loads.
    // Its job is to check if we have already saved user info in the browser's storage.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // If we find stored user info, we parse it from a string back into an object
            // and save it in our 'user' state. This keeps you logged in between refreshes.
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        // When the user clicks "Logout", we clear their info from storage.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // We reset the 'user' state to null.
        setUser(null);
        // And we redirect them to the login page.
        navigate('/login');
    };

    // --- All the CSS styles for the layout ---
    const navStyle = { /* ... styles ... */ }, linkStyle = { /* ... styles ... */ }, logoStyle = { /* ... styles ... */ };

    return (
        <div>
            {/* This is the navigation bar at the top of the page */}
            <nav style={navStyle}>
                <Link to="/" style={logoStyle}>Sheetsight</Link>
                <div>
                    {/* This is a conditional check. What links do we show? */}
                    {user ? (
                        // If the 'user' object exists (meaning someone is logged in)...
                        <>
                            {/* ...then we do another check: Is this user's role 'admin'? */}
                            {user.role === 'admin' && (
                                // If it is, we show the "Admin" link.
                                <Link to="/admin" style={linkStyle}>Admin</Link>
                            )}
                            {/* We always show the Dashboard and Logout links for any logged-in user. */}
                            <Link to="/" style={linkStyle}>Dashboard</Link>
                            <span onClick={handleLogout} style={linkStyle}>Logout</span>
                        </>
                    ) : (
                        // If the 'user' object is null (no one is logged in)...
                        // ...we show the Login and Register links.
                        <>
                            <Link to="/login" style={linkStyle}>Login</Link>
                            <Link to="/register" style={linkStyle}>Register</Link>
                        </>
                    )}
                </div>
            </nav>
            {/* This is the main content area of the page */}
            <main style={{ padding: '2rem' }}>
                {/* The Routes component decides which page to show based on the URL. */}
                <Routes>
                    {/* We pass the 'setUser' function to the Login component so it can update the navbar. */}
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    {/* The Dashboard route is protected. You must be logged in to see it. */}
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    {/* 2. We add our new Admin route. It is also protected by the same guard. */}
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;