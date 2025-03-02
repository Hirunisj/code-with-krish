import React from 'react';
import ProductForm from '../components/ProductForm';

export default function Products() {
  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto p-4 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
            <ProductForm />
            </div>
        </div>
  );
}