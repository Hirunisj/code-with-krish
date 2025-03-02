import React from 'react';
import OrderForm from '../components/OrderForm';
import OrderTable from '../components/OrderTable';

export default function Orders() {
  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto p-4 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">Orders</h1>
            <OrderForm />
            <OrderTable />
            </div>
        </div>
  );
}