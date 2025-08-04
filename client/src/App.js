import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import Guest from './pages/Guest';
import GuestRoute from './components/GuestRoute'; // Import the new guard

const App = () => (<Router><Layout /></Router>);

const Layout = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/'); // On logout, go to the Guest page
    };

    // --- All CSS styles ---
    const navStyle = { backgroundColor: 'white', padding: '1rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const linkStyle = { textDecoration: 'none', color: '#007bff', margin: '0 10px', fontWeight: 'bold', cursor: 'pointer' };
    const logoStyle = { ...linkStyle, fontSize: '1.5rem', color: '#333' };
    const appStyle = { minHeight: '100vh', backgroundColor: '#f4f7f6' };

    return (
        <div style={appStyle}>
            <nav style={navStyle}>
                <Link to="/" style={logoStyle}>Sheetsight</Link>
                <div>
                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin" style={linkStyle}>Admin Panel</Link>}
                            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                            <span onClick={handleLogout} style={linkStyle}>Logout</span>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>Login</Link>
                            <Link to="/register" style={linkStyle}>Register</Link>
                        </>
                    )}
                </div>
            </nav>
            <main style={{ padding: '2rem' }}>
                <Routes>
                    {/* These routes are for guests. Logged-in users will be redirected. */}
                    <Route path="/" element={<GuestRoute><Guest /></GuestRoute>} />
                    <Route path="/login" element={<GuestRoute><Login setUser={setUser} /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                    
                    {/* These routes are for logged-in users. Guests will be redirected. */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;