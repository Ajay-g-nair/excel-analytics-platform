import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://sheetsight.onrender.com/api/users/register', formData);
            setMessage('Registration successful! Redirecting to login...');
            // After 2 seconds, automatically send the user to the login page
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage(err.response.data.msg || 'Something went wrong');
        }
    };

    // --- CSS Styles (consistent with the Login page) ---
    const styles = {
        container: { minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
        card: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' },
        title: { fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' },
        form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
        button: { backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
        link: { color: '#007bff', textDecoration: 'none' },
        message: { padding: '10px', margin: '1rem 0', borderRadius: '4px', color: 'white' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Create Account</h1>
                
                {message && (
                    <p style={{ ...styles.message, backgroundColor: message.startsWith('Registration successful') ? '#28a745' : '#dc3545' }}>
                        {message}
                    </p>
                )}

                <form onSubmit={onSubmit} style={styles.form}>
                    <input type="text" placeholder="Username" name="username" value={formData.username} onChange={onChange} required style={styles.input} />
                    <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required style={styles.input} />
                    <input type="password" placeholder="Password (min 6 characters)" name="password" value={formData.password} onChange={onChange} required minLength="6" style={styles.input} />
                    <button type="submit" style={styles.button}>Register</button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;