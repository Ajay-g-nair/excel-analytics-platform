import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Note the new '{ setUser }' prop for communicating with App.js
const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://sheetsight.onrender.com/api/users/login', formData);

            // 1. Store the token
            localStorage.setItem('token', res.data.token);
            // 2. Store the entire user object (which includes the role) as a JSON string
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // 3. Update the state in the main App component to show the correct navbar
            setUser(res.data.user);

            setMessage('Login successful! Redirecting...');
            
            // 4. Redirect to the dashboard
            navigate('/');

        } catch (err) {
            // Clear any old data on failed login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setMessage(err.response.data.msg || 'Something went wrong');
        }
    };

    // --- CSS Styles (no changes here) ---
    const styles = {
        container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
        card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' },
        title: { fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' },
        form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
        button: { backgroundColor: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
        link: { color: '#007bff', textDecoration: 'none' },
        message: { padding: '10px', margin: '1rem 0', borderRadius: '4px', color: 'white' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Sign In</h1>
                
                {message && (
                    <p style={{ ...styles.message, backgroundColor: message.startsWith('Login successful') ? '#28a745' : '#dc3545' }}>
                        {message}
                    </p>
                )}

                <form onSubmit={onSubmit} style={styles.form}>
                    <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required style={styles.input} />
                    <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} required style={styles.input} />
                    <button type="submit" style={styles.button}>Login</button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;