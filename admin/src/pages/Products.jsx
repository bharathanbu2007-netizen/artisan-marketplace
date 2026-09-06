import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { connectSocket, getSocket } from '../services/socket';

export default function Products() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const { data } = await api.get('/products', { params: { limit: 50 } });
    setProducts(data.data.products);
  };

  useEffect(() => {
    load();

    // Real-time: refresh the table the moment any artisan publishes a
    // product, instead of requiring a manual page reload.
    connectSocket();
    const socket = getSocket();
    socket?.on('product:published', () => load());

    return () => socket?.off('product:published');
  }, []);

  return (
    <div>
      <Navbar title="Products" />
      <div className="card">
        <table>
          <thead>
            <tr><th>Title</th><th>Artisan</th><th>Price</th><th>Status</th><th>Views</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.artisanId?.businessName || '—'}</td>
                <td>₹{p.pricing?.manufacturerPrice}</td>
                <td><span className="badge success">{p.status}</span></td>
                <td>{p.views}</td>
              </tr>
            ))}
            {!products.length && <tr><td colSpan={5}>No products yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
