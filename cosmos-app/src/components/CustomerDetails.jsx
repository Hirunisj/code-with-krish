import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchCustomers } from '../service/customerService';

export default function CustomerDetails() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        getCustomers();
    }, []);

    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">Customer Details</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">ID</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Address</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="border px-4 py-2">{customer.id}</td>
                            <td className="border px-4 py-2">{customer.name}</td>
                            <td className="border px-4 py-2">{customer.email}</td>
                            <td className="border px-4 py-2">{customer.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}