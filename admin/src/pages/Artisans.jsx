import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const { data } = await api.get('/artisans');
      setArtisans(data.data.artisans);
    } catch (err) {
      console.error('[Artisans] load failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load artisans.');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <Navbar title="Artisans" />
      {error && <div className="error-text" style={{ marginBottom: 12 }}>{error}</div>}
      <div className="card">
        <table>
          <thead>
            <tr><th>Business Name</th><th>Craft Type</th><th>Location</th><th>Status</th><th>Products</th></tr>
          </thead>
          <tbody>
            {artisans.map((a) => (
              <tr key={a._id}>
                <td>{a.businessName}</td>
                <td>{a.craftType}</td>
                <td>{[a.location?.village, a.location?.district, a.location?.state].filter(Boolean).join(', ')}</td>
                <td><span className={`badge ${a.verification?.status === 'verified' ? 'success' : 'pending'}`}>{a.verification?.status}</span></td>
                <td>{a.statistics?.products ?? 0}</td>
              </tr>
            ))}
            {!artisans.length && <tr><td colSpan={5}>No artisans yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
