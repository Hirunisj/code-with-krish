import { api_product } from './api';

export const createProduct = async (productDetails) => {
  try {
    console.log('Creating product with details:', productDetails);
    const response = await api_product.post('/products', productDetails);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response ? error.response.data : error.message); 
    throw error;
  }
};