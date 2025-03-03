import axios from 'axios';

const api_customer = axios.create({
    baseURL: 'http://localhost:3002',
    headers: {
        'Content-Type': 'application/json',
    },
});

const api_product = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export { api_customer, api_product };