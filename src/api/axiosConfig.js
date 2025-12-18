import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Porta onde o Spring está rodando
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;