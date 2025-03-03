import { api_customer } from './api';

export const fetchCustomers = async () => {
    try {
        const response = await api_customer.get('/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

export const createCustomer = async (customerDetails) => {
    try {
        const response = await api_customer.post('/customers', customerDetails);
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};

