import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const load = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.data.categories);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/categories', { name });
    setName('');
    load();
  };

  return (
    <div>
      <Navbar title="Categories" />
      <form onSubmit={create} className="card" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Slug</th><th>Status</th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td><span className="badge success">{c.isActive ? 'active' : 'inactive'}</span></td>
              </tr>
            ))}
            {!categories.length && <tr><td colSpan={3}>No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
