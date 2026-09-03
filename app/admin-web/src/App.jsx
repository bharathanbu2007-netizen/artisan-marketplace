import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SellerApproval from './pages/SellerApproval';
import ProductApproval from './pages/ProductApproval';
import Reports from './pages/Reports';

export default function App() {
  return (
    <HashRouter>
      <div style={{ display: 'flex', fontFamily: 'system-ui, sans-serif', background: '#FFF8F0', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 32 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/sellers" element={<SellerApproval />} />
            <Route path="/products" element={<ProductApproval />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
