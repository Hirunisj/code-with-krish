import React from 'react';
import CustomerForm from '../components/CustomerForm';
import CustomerDetails from '../components/CustomerDetails';

export default function Customers() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="container mx-auto p-4 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Customers</h1>
        <CustomerForm />
        <CustomerDetails />
        </div>
    </div>
  );
}