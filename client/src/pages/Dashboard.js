import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [fileHistory, setFileHistory] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [headers, setHeaders] = useState([]);
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);

    // This creates a reusable axios instance for making API calls
    const api = axios.create({ baseURL: 'https://sheetsight.onrender.com' });

    // This function fetches the user's file history from the backend
    const fetchFileHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await api.get('/api/files/my-files', { headers: { 'x-auth-token': token } });
            setFileHistory(res.data);
        } catch (err) { 
            console.error("Could not fetch history:", err);
            setMessage("Session expired. Please log in again.");
        }
    };

    // This hook runs once when the page loads to get the initial history
    useEffect(() => { 
        fetchFileHistory(); 
    }, []);

    // This hook runs anytime the user changes the X or Y axis to generate chart data
    useEffect(() => {
        if (selectedFile && xAxis !== '' && yAxis !== '') {
            const xIndex = parseInt(xAxis);
            const yIndex = parseInt(yAxis);
            const labels = selectedFile.data.map(row => row[xIndex] || '');
            const dataPoints = selectedFile.data.map(row => parseFloat(row[yIndex]) || 0);
            setChartData({
                labels,
                datasets: [{
                    label: `Analysis of ${selectedFile.filename}`,
                    data: dataPoints,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }],
            });
        } else { 
            setChartData(null); 
        }
    }, [selectedFile, xAxis, yAxis]);

    // Handler for the file input
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handler for the upload button
    const handleUpload = async () => {
        if (!file) return alert('Please select a file first!');
        const formData = new FormData();
        formData.append('excelFile', file);
        const token = localStorage.getItem('token');
        if (!token) return setMessage('You must be logged in to upload a file.');

        try {
            await api.post('/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token },
            });
            setMessage('Success: File uploaded!');
            fetchFileHistory(); // Refresh the history list after a new upload
        } catch (error) {
            setMessage('Upload failed. Please try again.');
        }
    };

    // Handler for when a user clicks on a file in the history list
    const handleFileSelect = (fileData) => {
        setSelectedFile(fileData);
        if (fileData?.data?.[0]) {
            const maxCols = Math.max(...fileData.data.map(r => r.length));
            setHeaders(Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`));
            setXAxis('');
            setYAxis('');
        }
    };

    // Handler for the download chart button
    const handleDownload = () => {
        if (chartRef.current) {
            const link = document.createElement('a');
            link.href = chartRef.current.toBase64Image();
            link.download = 'sheetsight-chart.png';
            link.click();
        }
    };

    // --- CSS Styles for the Dashboard ---
    const styles = {
        card: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', marginBottom: '2rem' },
        button: { padding: '12px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'background-color 0.3s' },
        select: { padding: '10px', margin: '0 12px 0 5px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px' },
        historyItem: { cursor: 'pointer', padding: '1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.3s' },
        gridContainer: { display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem', alignItems: 'start' }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={styles.gridContainer}>
                {/* Left Column */}
                <div>
                    <div style={styles.card}>
                        <h2 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1rem' }}>Upload New File</h2>
                        <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} style={{ display: 'block', margin: '1rem 0' }} />
                        <button onClick={handleUpload} style={styles.button}>Upload</button>
                        {message && <p style={{ color: message.startsWith('Success') ? '#2ecc71' : '#e74c3c', marginTop: '1rem', fontWeight: '500' }}>{message}</p>}
                    </div>

                    <div style={styles.card}>
                        <h2>Upload History</h2>
                        {fileHistory.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                                {fileHistory.map((item) => ( 
                                    <li key={item._id} onClick={() => handleFileSelect(item)} style={styles.historyItem}>
                                        <span style={{fontWeight: '500'}}>{item.filename}</span>
                                    </li> 
                                ))}
                            </ul>
                        ) : (<p>No files uploaded yet.</p>)}
                    </div>
                </div>

                {/* Right Column */}
                <div style={styles.card}>
                    <h2>Analysis Dashboard</h2>
                    {!selectedFile ? (<p>Select a file from your history to begin analysis.</p>) : (
                        <div>
                            <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center' }}>
                                <label>X-Axis:</label>
                                <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} style={styles.select}>
                                    <option value="">Select</option>
                                    {headers.map((h, i) => (<option key={i} value={i}>{h}</option>))}
                                </select>
                                <label>Y-Axis:</label>
                                <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} style={styles.select}>
                                    <option value="">Select</option>
                                    {headers.map((h, i) => (<option key={i} value={i}>{h}</option>))}
                                </select>
                            </div>
                            {chartData ? (
                                <div style={{marginTop: '2rem'}}>
                                    <ChartComponent ref={chartRef} chartData={chartData} />
                                    <button onClick={handleDownload} style={{...styles.button, backgroundColor: '#2ecc71', marginTop: '1rem'}}>Download Chart</button>
                                </div>
                            ) : (<p style={{marginTop: '2rem', color: '#7f8c8d'}}>Choose an X and Y axis to generate a chart.</p>)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;