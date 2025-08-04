import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// This is the new component for the Admin "All Files" page
const AdminFiles = () => {
    // State to hold the list of all files fetched from the server
    const [files, setFiles] = useState([]);
    // State to hold any error messages
    const [message, setMessage] = useState('');

    // This hook runs once when the component is first loaded
    useEffect(() => {
        const fetchAllFiles = async () => {
            const token = localStorage.getItem('token');
            try {
                // Make a GET request to our new admin-only endpoint for files
                const res = await axios.get('https://sheetsight.onrender.com/api/files/admin/all-files', {
                    headers: { 'x-auth-token': token } // Send the token for authorization
                });
                // If successful, store the fetched file list in state
                setFiles(res.data);
            } catch (err) {
                // If there's an error (e.g., not an admin), set an error message
                setMessage(err.response.data.msg || "Could not fetch files.");
            }
        };

        fetchAllFiles();
    }, []); // The empty array ensures this effect only runs once

    // --- CSS Styles ---
    const cardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f9f9f9', textAlign: 'left', fontWeight: '600' };
    const tdStyle = { border: '1px solid #ddd', padding: '12px' };

    return (
        <div style={cardStyle}>
            {/* A link to go back to the main Admin Panel */}
            <Link to="/admin" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '1rem', display: 'inline-block' }}>
                ← Back to Admin Panel
            </Link>
            <h1>Admin Panel - All Uploaded Files</h1>
            {message && <p style={{color: 'red'}}>{message}</p>}
            
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Filename</th>
                        <th style={thStyle}>Uploaded By (Username)</th>
                        <th style-={thStyle}>Upload Date</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map(file => (
                        <tr key={file._id}>
                            <td style={tdStyle}>{file.filename}</td>
                            {/* The 'userId' is now an object with the username, so we can display it */}
                            <td style={tdStyle}>{file.userId ? file.userId.username : 'N/A'}</td>
                            <td style={tdStyle}>{new Date(file.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminFiles;