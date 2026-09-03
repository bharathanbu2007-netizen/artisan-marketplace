import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/summary').then(({ data }) => setSummary(data.summary)).catch(() => {});
  }, []);

  const cards = summary
    ? [
        { label: 'Total Users', value: summary.totalUsers },
        { label: 'Sellers', value: summary.totalSellers },
        { label: 'Buyers', value: summary.totalBuyers },
        { label: 'Active Products', value: `${summary.activeProducts} / ${summary.totalProducts}` },
        { label: 'Total Orders', value: summary.totalOrders },
        { label: 'Revenue', value: `₹${summary.totalRevenue}` },
      ]
    : [];

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>
      <div style={styles.grid}>
        {cards.map((c) => (
          <div key={c.label} style={styles.card}>
            <div style={styles.cardLabel}>{c.label}</div>
            <div style={styles.cardValue}>{c.value}</div>
          </div>
        ))}
      </div>
      {!summary && <p style={{ color: '#8A7A6D' }}>Loading summary… (requires backend + admin login)</p>}
    </div>
  );
}

const styles = {
  title: { marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  card: { background: '#fff', border: '1px solid #EBDFCF', borderRadius: 10, padding: 18 },
  cardLabel: { fontSize: 13, color: '#8A7A6D' },
  cardValue: { fontSize: 26, fontWeight: 700, color: '#B5651D', marginTop: 6 },
};
