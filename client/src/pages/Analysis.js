import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Hook to get URL parameters like the fileId

const Analysis = () => {
    // State to hold the full data of the file
    const [fileData, setFileData] = useState(null);
    // State to hold just the column headers
    const [columns, setColumns] = useState([]);
    // State to hold any error messages
    const [message, setMessage] = useState('Loading data...');

    // State for user's axis selections
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');

    // Get the fileId from the URL (e.g., from /analysis/688ddb...)
    const { fileId } = useParams();

    // This useEffect hook runs once when the component loads
    useEffect(() => {
        const fetchFileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authorization failed. Please log in.');
                return;
            }

            try {
                // Fetch the data for this specific file from the backend
                const res = await axios.get(`https://sheetsight.onrender.com/api/files/${fileId}`, {
                    headers: { 'x-auth-token': token },
                });

                // The actual Excel data is in the 'data' property of the response
                const data = res.data.data;

                setFileData(res.data); // Save the full file object
                setMessage(''); // Clear the loading message

                // If we got data, figure out the column headers from the first row of data
                if (data && data.length > 0) {
                    setColumns(Object.keys(data[0]));
                }

            } catch (err) {
                console.error('Error fetching file data:', err);
                setMessage('Failed to load file data. You may not have permission or the file does not exist.');
            }
        };

        fetchFileData();
    }, [fileId]); // The hook re-runs if the fileId in the URL changes

    // Render the component
    return (
        <div>
            <h1>File Analysis</h1>
            {/* Show loading or error messages */}
            {message && <p>{message}</p>}

            {/* Only show the content if the file data has been loaded */}
            {fileData && (
                <div>
                    <h2>{fileData.filename}</h2>
                    <p>Please select the columns for the X and Y axes to generate a chart.</p>
                    
                    <div>
                        {/* Dropdown for X-Axis */}
                        <label htmlFor="x-axis-select">X-Axis: </label>
                        <select id="x-axis-select" value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
                            <option value="">-- Select Column --</option>
                            {columns.map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                    </div>

                    <div>
                        {/* Dropdown for Y-Axis */}
                        <label htmlFor="y-axis-select">Y-Axis: </label>
                        <select id="y-axis-select" value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
                            <option value="">-- Select Column --</option>
                            {columns.map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                    </div>

                    <hr />
                    {/* The chart will be rendered here in the next step */}
                    <h3>Chart will appear here</h3>
                </div>
            )}
        </div>
    );
};

export default Analysis;