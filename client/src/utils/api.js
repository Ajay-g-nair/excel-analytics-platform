import axios from 'axios';

// Create a custom instance of axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // The base URL for all our API requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;