import React from 'react';
import { Link } from 'react-router-dom';

// This is the component for the guest landing page.
const Guest = () => {

    // --- CSS Styles for the landing page ---
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '80vh', // Take up most of the screen height
            color: '#333'
        },
        title: {
            fontSize: '3.5rem', // Big, bold title
            fontWeight: 'bold',
            marginBottom: '1rem'
        },
        subtitle: {
            fontSize: '1.25rem',
            color: '#666',
            maxWidth: '600px', // Keep the text from getting too wide
            marginBottom: '2rem'
        },
        buttonContainer: {
            display: 'flex',
            gap: '1rem' // Space between the buttons
        },
        button: {
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#007bff',
            padding: '12px 24px',
            borderRadius: '5px',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to Sheetsight</h1>
            <p style={styles.subtitle}>
                The simplest way to analyze your Excel data. Upload your spreadsheets,
                map your columns, and instantly generate beautiful, downloadable charts.
                Turn your data into insights in just a few clicks.
            </p>
            <div style={styles.buttonContainer}>
                <Link to="/login" style={styles.button}>Login</Link>
                <Link to="/register" style={{...styles.button, backgroundColor: '#28a745'}}>Register</Link>
            </div>
        </div>
    );
};

export default Guest;   