import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/artisans', label: 'Artisans' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/categories', label: 'Categories' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Artisan Admin</h1>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
          {l.label}
        </NavLink>
      ))}
    </aside>
  );
}
