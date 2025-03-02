import { api_order } from './api';

export const createOrder = async (orderDetails) => {
  try {
    console.log('Creating order with details:', orderDetails);
    const response = await api_order.post('/orders', orderDetails);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await api_order.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    throw error;
  }
};