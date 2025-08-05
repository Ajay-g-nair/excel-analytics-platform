import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://sheetsight.onrender.com/api/users/login', formData);
            localStorage.setItem('token', res.data.token);
            setMessage('Login successful! Redirecting...');
            navigate('/');
        } catch (err) {
            setMessage(err.response.data.msg || 'Something went wrong');
        }
    };

    const styles = {
        container: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '420px', width: '100%', textAlign: 'center' },
        title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '1rem' },
        subtitle: { color: '#7f8c8d', marginBottom: '2rem' },
        form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
        input: { width: '100%', padding: '14px', border: '1px solid #dfe6e9', borderRadius: '8px', fontSize: '1rem' },
        button: { background: 'linear-gradient(90deg, #3498db, #2980b9)', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'transform 0.2s' },
        link: { color: '#3498db', textDecoration: 'none', fontWeight: 'bold' },
        message: { padding: '12px', margin: '1rem 0', borderRadius: '8px', color: 'white' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome Back!</h1>
                <p style={styles.subtitle}>Sign in to continue to Sheetsight</p>
                {message && <p style={{...styles.message, backgroundColor: message.startsWith('Login successful') ? '#2ecc71' : '#e74c3c'}}>{message}</p>}
                <form onSubmit={onSubmit} style={styles.form}>
                    <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} required style={styles.input} />
                    <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} required style={styles.input} />
                    <button type="submit" style={styles.button}>Sign In</button>
                </form>
                <p style={{ marginTop: '2rem', color: '#7f8c8d' }}>
                    Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;