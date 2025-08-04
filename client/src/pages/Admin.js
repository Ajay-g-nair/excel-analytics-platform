import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This component is the Admin Dashboard page
const Admin = () => {
    // State to hold the list of users fetched from the server
    const [users, setUsers] = useState([]);
    // State to hold any error messages
    const [message, setMessage] = useState('');

    // This useEffect hook runs once when the component is first loaded
    useEffect(() => {
        const fetchUsers = async () => {
            // Get the authentication token from browser's local storage
            const token = localStorage.getItem('token');
            try {
                // Make a GET request to our new admin-only endpoint
                const res = await axios.get('https://sheetsight.onrender.com/api/users/admin/users', {
                    headers: { 'x-auth-token': token } // Send the token for authorization
                });
                // If successful, store the fetched user list in state
                setUsers(res.data);
            } catch (err) {
                // If there's an error (e.g., not an admin), set an error message
                setMessage(err.response.data.msg || "Could not fetch users.");
            }
        };

        fetchUsers();
    }, []); // The empty array ensures this effect only runs once

    // --- CSS Styles ---
    const cardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f9f9f9', textAlign: 'left', fontWeight: '600' };
    const tdStyle = { border: '1px solid #ddd', padding: '12px' };

    return (
        <div style={cardStyle}>
            <h1>Admin Panel - All Users</h1>
            {message && <p style={{color: 'red'}}>{message}</p>}
            
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Username</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Joined On</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td style={tdStyle}>{user.username}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>{user.role}</td>
                            <td style={tdStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;