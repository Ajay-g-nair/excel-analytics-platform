import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Note the new '{ setUser }' prop here. This is how App.js gives this component
// the ability to change the main application's state.
const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // We send the login request to the live backend server.
            const res = await axios.post('https://sheetsight.onrender.com/api/users/login', formData);

            // If the login is successful, we perform four actions:
            // 1. Store the login token in the browser's memory.
            localStorage.setItem('token', res.data.token);
            // 2. Store the user's details (including their role) in memory.
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // 3. Call the 'setUser' function given to us by App.js to update the navbar.
            setUser(res.data.user);
            
            setMessage('Login successful! Redirecting...');
            
            // 4. Navigate the user to the main dashboard page.
            navigate('/');

        } catch (err) {
            // If the login fails, we clear any old data from memory.
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setMessage(err.response.data.msg || 'Something went wrong');
        }
    };

    // --- All the CSS styles for this component ---
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