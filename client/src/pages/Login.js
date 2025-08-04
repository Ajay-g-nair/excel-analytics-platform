import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- THIS IS THE FUNCTION WE ARE DEBUGGING ---
    const onSubmit = async (e) => {
        // This prevents the whole page from reloading
        e.preventDefault();
        
        console.log('DEBUG: 1. onSubmit function started.');
        console.log('DEBUG: 2. Form data being sent:', formData);
        
        try {
            console.log('DEBUG: 3. Attempting axios.post request...');
            const res = await axios.post('https://sheetsight.onrender.com/api/users/login', formData);
            
            console.log('DEBUG: 4. SUCCESS! Received response from server:', res.data);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setMessage('Login successful! Redirecting...');

            if (user.role === 'admin') {
                console.log('DEBUG: 5. User is an admin, navigating to /admin');
                navigate('/admin');
            } else {
                console.log('DEBUG: 5. User is a regular user, navigating to /dashboard');
                navigate('/dashboard');
            }

        } catch (err) {
            console.log('DEBUG: 6. ERROR! The axios request failed.');
            console.error('Full error object:', err);
            setMessage(err.response?.data?.msg || 'Something went wrong');
        }
    };

    // --- CSS Styles ---
    const styles = {
        container: { minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
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
                
                {/* Ensure the form has the onSubmit handler */}
                <form onSubmit={onSubmit} style={styles.form}>
                    <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required style={styles.input} />
                    <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} required style={styles.input} />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link></p>
            </div>
        </div>
    );
};

export default Login;