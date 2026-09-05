import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data } = await api.get('/orders');
    setOrders(data.data.orders);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}`, { status });
    load();
  };

  return (
    <div>
      <Navbar title="Orders" />
      <div className="card">
        <table>
          <thead>
            <tr><th>Order</th><th>Total</th><th>Status</th><th>Payment</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6)}</td>
                <td>₹{o.totalAmount}</td>
                <td><span className="badge pending">{o.status}</span></td>
                <td>{o.paymentStatus}</td>
                <td>
                  <select defaultValue={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={5}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
