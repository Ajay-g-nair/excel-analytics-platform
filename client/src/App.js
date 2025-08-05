import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
// These are the correct import paths with forward slashes
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
    const token = localStorage.getItem('token');
    
    const Navbar = () => {
        const navigate = useNavigate();
        const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
            window.location.reload(); 
        };

        const styles = {
            nav: { backgroundColor: 'white', padding: '1rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
            logo: { textDecoration: 'none', fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' },
            navLinks: { display: 'flex', alignItems: 'center' },
            link: { textDecoration: 'none', color: '#34495e', margin: '0 1rem', fontWeight: '500' },
            button: { padding: '10px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }
        };

        return (
            <nav style={styles.nav}>
                <Link to="/" style={styles.logo}>Sheetsight</Link>
                <div style={styles.navLinks}>
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