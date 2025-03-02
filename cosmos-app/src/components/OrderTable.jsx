import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Details</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">Customer ID</th>
            <th className="py-2">Created At</th>
            <th className="py-2">Status</th>
            <th className="py-2">Order Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.customerID}</td>
              <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.id}>
                      Product ID: {item.productID}, Price: {item.price}, Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}