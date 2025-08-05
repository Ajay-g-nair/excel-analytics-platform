import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
    // Check if a token exists in local storage to determine login status
    const token = localStorage.getItem('token');
    
    // The Navbar component is defined inside App.js for simplicity
    const Navbar = () => {
        const navigate = useNavigate();

        // Function to handle user logout
        const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
            // We use window.location.reload() to ensure all state is cleared
            window.location.reload(); 
        };

        const styles = {
            nav: { 
                backgroundColor: 'white', 
                padding: '1rem 2rem', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            },
            logo: { 
                textDecoration: 'none', 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                color: '#2c3e50' 
            },
            navLinks: { 
                display: 'flex', 
                alignItems: 'center' 
            },
            link: { 
                textDecoration: 'none', 
                color: '#34495e', 
                margin: '0 1rem', 
                fontWeight: '500' 
            },
            button: { 
                padding: '10px 15px', 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontSize: '1rem' 
            }
        };

        return (
            <nav style={styles.nav}>
                <Link to="/" style={styles.logo}>Sheetsight</Link>
                <div style={styles.navLinks}>
                    {/* Conditionally render links based on login status */}
                    {!token ? (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/register" style={styles.link}>Register</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                    )}
                </div>
            </nav>
        );
    };

    return (
        <Router>
            <Navbar />
            <main style={{ padding: '2rem' }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;