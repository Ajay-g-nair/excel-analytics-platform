import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';

const Dashboard = () => {
    // --- STATE MANAGEMENT ---
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [fileHistory, setFileHistory] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [headers, setHeaders] = useState([]);
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);
    const fileInputRef = useRef(null);

    // --- DATA FETCHING & LOGIC ---
    const fetchFileHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await axios.get('https://sheetsight.onrender.com/api/files/my-files', {
                headers: { 'x-auth-token': token },
            });
            setFileHistory(res.data);
        } catch (err) {
            console.error('Error fetching file history:', err);
            setMessage('Could not fetch file history.');
        }
    };

    useEffect(() => {
        fetchFileHistory();
    }, []);

    useEffect(() => {
        if (selectedFile && xAxis !== '' && yAxis !== '') {
            const xIndex = parseInt(xAxis);
            const yIndex = parseInt(yAxis);
            const labels = selectedFile.data.map(row => row[xIndex] || '');
            const dataPoints = selectedFile.data.map(row => parseFloat(row[yIndex]) || 0);

            setChartData({
                labels,
                datasets: [{
                    label: `Data Analysis`,
                    data: dataPoints,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            });
        } else {
            setChartData(null);
        }
    }, [selectedFile, xAxis, yAxis]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('excelFile', file);
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://sheetsight.onrender.com/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token },
            });
            setMessage('Success: File uploaded!');
            setFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            fetchFileHistory(); // Refresh list after upload
        } catch (error) {
            setMessage('Upload failed.');
        }
    };

    const handleFileSelect = (fileData) => {
        setSelectedFile(fileData);
        if (fileData?.data?.[0]) {
            const maxCols = Math.max(...fileData.data.map(row => row.length));
            setHeaders(Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`));
            setXAxis('');
            setYAxis('');
        }
    };

    const handleDownload = () => {
        if (chartRef.current) {
            const link = document.createElement('a');
            link.href = chartRef.current.toBase64Image();
            link.download = 'chart.png';
            link.click();
        }
    };

    // --- PROFESSIONAL CSS STYLES ---
    const styles = {
        dashboardContainer: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' },
        leftColumn: { display: 'flex', flexDirection: 'column', gap: '2rem' },
        rightColumn: { display: 'flex', flexDirection: 'column' },
        card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
        cardTitle: { fontSize: '1.25rem', fontWeight: '600', color: '#333', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' },
        button: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.3s' },
        fileInputLabel: { display: 'block', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px', cursor: 'pointer', textAlign: 'center', marginBottom: '1rem' },
        historyList: { listStyle: 'none', padding: 0, margin: 0, maxHeight: '400px', overflowY: 'auto' },
        historyItem: { cursor: 'pointer', padding: '12px 10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.2s' },
        selectContainer: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' },
        select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    };

    return (
        <div style={styles.dashboardContainer}>
            <div style={styles.leftColumn}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📤 Upload New File</h2>
                    <label htmlFor="file-upload" style={styles.fileInputLabel}>{file ? file.name : 'Choose File'}</label>
                    <input id="file-upload" type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xls, .xlsx" style={{ display: 'none' }} />
                    <button onClick={handleUpload} style={styles.button} disabled={!file}>Upload Now</button>
                    {message && <p style={{ color: message.startsWith('Success') ? 'green' : 'red', marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
                </div>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📜 Upload History</h2>
                    {fileHistory.length > 0 ? (
                        <ul style={styles.historyList}>
                            {fileHistory.map((item) => (
                                <li key={item._id} onClick={() => handleFileSelect(item)} style={styles.historyItem}>
                                    <span>{item.filename}</span><small>{new Date(item.createdAt).toLocaleDateString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No files uploaded yet.</p>}
                </div>
            </div>
            <div style={styles.rightColumn}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📊 Analysis Dashboard</h2>
                    {selectedFile ? (
                        <div>
                            <div style={styles.selectContainer}>
                                <div><label>X-Axis:</label><select value={xAxis} onChange={(e) => setXAxis(e.target.value)} style={styles.select}><option value="">Select</option>{headers.map((h, i) => (<option key={i} value={i}>{h}</option>))}</select></div>
                                <div><label>Y-Axis:</label><select value={yAxis} onChange={(e) => setYAxis(e.target.value)} style={styles.select}><option value="">Select</option>{headers.map((h, i) => (<option key={i} value={i}>{h}</option>))}</select></div>
                            </div>
                            {chartData ? (
                                <div>
                                    <ChartComponent ref={chartRef} chartData={chartData} />
                                    <button onClick={handleDownload} style={{...styles.button, backgroundColor: '#28a745', marginTop: '1rem'}}>Download Chart</button>
                                </div>
                            ) : <p>Please select both an X and Y axis to generate a chart.</p>}
                        </div>
                    ) : ( <p>Select a file from your history to begin analysis.</p> )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;