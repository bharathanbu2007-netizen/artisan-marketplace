import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, artisans: 0, products: 0, orders: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [artisans, products, orders] = await Promise.all([
          api.get('/artisans'),
          api.get('/products', { params: { limit: 1 } }),
          api.get('/orders'),
        ]);
        setStats({
          users: '—',
          artisans: artisans.data.data.artisans.length,
          products: products.data.data.total,
          orders: orders.data.data.orders.length,
        });
      } catch {
        // endpoints may require different roles/permissions in a real deployment
      }
    })();
  }, []);

  return (
    <div>
      <Navbar title="Dashboard" />
      <div className="grid">
        <div className="card"><div>Verified Artisans</div><h2>{stats.artisans}</h2></div>
        <div className="card"><div>Published Products</div><h2>{stats.products}</h2></div>
        <div className="card"><div>Orders</div><h2>{stats.orders}</h2></div>
        <div className="card"><div>Users</div><h2>{stats.users}</h2></div>
      </div>
      <div className="card">
        <p>Welcome to the AI Artisan Marketplace admin panel. Use the sidebar to manage users, artisans,
        products, orders, categories, reports and app version releases.</p>
      </div>
    </div>
  );
}
