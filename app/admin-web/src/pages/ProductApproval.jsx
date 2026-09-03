import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import api from '../services/api';

export default function ProductApproval() {
  const [products, setProducts] = useState([]);

  function load() {
    api.get('/admin/products/pending').then(({ data }) => setProducts(data.products)).catch(() => {});
  }

  useEffect(load, []);

  async function review(product, status) {
    await api.patch(`/admin/products/${product._id}/review`, { status });
    load();
  }

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Pending Product Approvals</h1>
      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'seller', label: 'Seller', render: (r) => r.seller?.name },
          { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price', render: (r) => `₹${r.price}` },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => review(r, 'active')} style={{ cursor: 'pointer' }}>Approve</button>
                <button onClick={() => review(r, 'rejected')} style={{ cursor: 'pointer' }}>Reject</button>
              </div>
            ),
          },
        ]}
        rows={products}
      />
    </div>
  );
}
