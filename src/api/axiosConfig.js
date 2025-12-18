import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Porta onde o Spring está rodando
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;