import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/summary').then(({ data }) => setSummary(data.summary)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Reports</h1>
      {summary ? (
        <pre style={{ background: '#fff', border: '1px solid #EBDFCF', borderRadius: 8, padding: 16 }}>
          {JSON.stringify(summary, null, 2)}
        </pre>
      ) : (
        <p style={{ color: '#8A7A6D' }}>No data yet.</p>
      )}
    </div>
  );
}
