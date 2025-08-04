import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// The Main App component that contains the router
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

// A separate Layout component to handle navigation and state, which is a common practice
const Layout = () => {
  // Check the initial login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  // This effect will help update the nav bar if login state changes in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Redirect to the login page after logout
    navigate('/login');
  };

  // --- CSS STYLES ---
  const appStyle = {
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    color: '#333'
  };
  const navStyle = {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    margin: '0 10px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };
  const logoStyle = {
    ...linkStyle,
    fontSize: '1.5rem',
    color: '#333'
  };

  return (
    <div style={appStyle}>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>Sheetsight</Link>
        <div>
          {isLoggedIn ? (
            // If logged in, show Dashboard and Logout
            <>
              <Link to="/" style={linkStyle}>Dashboard</Link>
              <span onClick={handleLogout} style={linkStyle}>Logout</span>
            </>
          ) : (
            // If not logged in, show Login and Register
            <>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link to="/register" style={linkStyle}>Register</Link>
            </>
          )}
        </div>
      </nav>
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;