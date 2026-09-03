import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/sellers', label: 'Seller Approval' },
  { to: '/products', label: 'Product Approval' },
  { to: '/reports', label: 'Reports' },
];

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>🧶 Artisan Marketplace</div>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: { width: 220, background: '#2B2118', color: '#fff', minHeight: '100vh', padding: '20px 0' },
  brand: { fontWeight: 700, fontSize: 18, padding: '0 20px 20px' },
  link: { display: 'block', padding: '12px 20px', color: '#D9CBB8', textDecoration: 'none', fontSize: 14 },
  linkActive: { background: '#B5651D', color: '#fff', fontWeight: 600 },
};
