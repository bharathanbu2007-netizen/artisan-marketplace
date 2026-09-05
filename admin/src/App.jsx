import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Artisans from './pages/Artisans';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Categories from './pages/Categories';

function AdminLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><AdminLayout><Users /></AdminLayout></ProtectedRoute>} />
      <Route path="/artisans" element={<ProtectedRoute><AdminLayout><Artisans /></AdminLayout></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><AdminLayout><Products /></AdminLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AdminLayout><Orders /></AdminLayout></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><AdminLayout><Categories /></AdminLayout></ProtectedRoute>} />
    </Routes>
  );
}
