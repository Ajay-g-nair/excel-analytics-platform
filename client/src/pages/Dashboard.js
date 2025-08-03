import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';

const Dashboard = () => {
    // State variables
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [fileHistory, setFileHistory] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [headers, setHeaders] = useState([]);
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);

    // Fetch history on component load
    useEffect(() => {
        const fetchFileHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:5000/api/files/my-files', {
                    headers: { 'x-auth-token': token },
                });
                setFileHistory(res.data);
            } catch (err) {
                console.error('Error fetching file history:', err);
                setMessage('Could not fetch file history.');
            }
        };
        fetchFileHistory();
    }, []);

    // Generate chart data when axes are selected
    useEffect(() => {
        if (selectedFile && xAxis !== '' && yAxis !== '') {
            const xIndex = parseInt(xAxis);
            const yIndex = parseInt(yAxis);
            const labels = selectedFile.data.map(row => row[xIndex] || '');
            const dataPoints = selectedFile.data.map(row => parseFloat(row[yIndex]) || 0);

            setChartData({
                labels,
                datasets: [{
                    label: `Column ${yIndex + 1} vs Column ${xIndex + 1}`,
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

    // Handler for file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handler for uploading a file
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }
        const formData = new FormData();
        formData.append('excelFile', file);
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to upload.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token },
            });
            setMessage('Success: File uploaded!');
            // After upload, refresh the history
            const res = await axios.get('http://localhost:5000/api/files/my-files', {
                headers: { 'x-auth-token': token },
            });
            setFileHistory(res.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Upload failed.');
        }
    };

    // Handler for selecting a file from the history
    const handleFileSelect = (fileData) => {
        setSelectedFile(fileData);
        if (fileData && fileData.data && fileData.data.length > 0 && fileData.data[0]) {
            const maxCols = Math.max(...fileData.data.map(row => row.length));
            const colHeaders = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
            setHeaders(colHeaders);
            setXAxis('');
            setYAxis('');
        }
    };

    // Handler for downloading the chart
    const handleDownload = () => {
        if (chartRef.current) {
            const link = document.createElement('a');
            link.href = chartRef.current.toBase64Image();
            link.download = 'chart.png';
            link.click();
        }
    };

    // --- CSS STYLES ---
    const cardStyle = {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    };
    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    };
    const selectStyle = {
        padding: '8px 12px',
        margin: '0 10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    };

    return (
        <div>
            <div style={cardStyle}>
                <h2>Upload a New Excel File</h2>
                <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} style={{ margin: '1rem 0' }} />
                <button onClick={handleUpload} style={buttonStyle}>Upload File</button>
                {message && <p style={{ color: message.startsWith('Success') ? 'green' : 'red', marginTop: '1rem' }}>{message}</p>}
            </div>

            <div style={cardStyle}>
                <h2>Your Upload History</h2>
                {fileHistory.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {fileHistory.map((fileItem) => (
                            <li key={fileItem._id} onClick={() => handleFileSelect(fileItem)} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}>
                                <strong>{fileItem.filename}</strong>
                                <span style={{ float: 'right', color: '#888' }}>{new Date(fileItem.createdAt).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : (<p>Log in to see your upload history.</p>)}
            </div>

            {selectedFile && (
                <div style={cardStyle}>
                    <h2>Analyze: {selectedFile.filename}</h2>
                    <div style={{ margin: '1rem 0' }}>
                        <label>X-Axis:</label>
                        <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} style={selectStyle}>
                            <option value="">Select</option>
                            {headers.map((header, index) => (<option key={index} value={index}>{header}</option>))}
                        </select>
                        <label>Y-Axis:</label>
                        <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} style={selectStyle}>
                            <option value="">Select</option>
                            {headers.map((header, index) => (<option key={index} value={index}>{header}</option>))}
                        </select>
                    </div>
                    {chartData && (
                        <div>
                            <ChartComponent ref={chartRef} chartData={chartData} />
                            <button onClick={handleDownload} style={{ ...buttonStyle, backgroundColor: '#28a745', marginTop: '1rem' }}>Download Chart</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;