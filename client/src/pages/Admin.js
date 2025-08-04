import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://sheetsight.onrender.com/api/users/admin/users', {
                    headers: { 'x-auth-token': token }
                });
                setUsers(res.data);
            } catch (err) {
                setMessage(err.response.data.msg || "Could not fetch users.");
            }
        };
        fetchUsers();
    }, []);

    const cardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f9f9f9', textAlign: 'left', fontWeight: '600' };
    const tdStyle = { border: '1px solid #ddd', padding: '12px' };
    const linkButtonStyle = {
        display: 'inline-block',
        textDecoration: 'none',
        backgroundColor: '#17a2b8',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        marginBottom: '1rem',
        fontWeight: 'bold'
    };

    return (
        <div style={cardStyle}>
            <h1>Admin Panel - All Users</h1>
            {message && <p style={{color: 'red'}}>{message}</p>}

            <Link to="/admin/files" style={linkButtonStyle}>
                View All Uploaded Files
            </Link>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Username</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Files Uploaded</th>
                        <th style={thStyle}>Joined On</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td style={tdStyle}>{user.username}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>{user.role}</td>
                            <td style={tdStyle}>{user.fileCount}</td>
                            <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;