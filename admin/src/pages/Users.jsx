import React from 'react';
import Navbar from '../components/Navbar';

export default function Users() {
  return (
    <div>
      <Navbar title="Users" />
      <div className="card">
        <p>Wire this page to a protected <code>GET /api/admin/users</code> endpoint
        (add one alongside the other admin routes) to list, verify, and deactivate accounts.</p>
      </div>
    </div>
  );
}
