import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import api from '../services/api';

export default function SellerApproval() {
  const [sellers, setSellers] = useState([]);

  function load() {
    api.get('/admin/sellers/pending').then(({ data }) => setSellers(data.sellers)).catch(() => {});
  }

  useEffect(load, []);

  async function approve(profile) {
    await api.patch(`/admin/sellers/${profile._id}/approve`);
    load();
  }

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Pending Seller Approvals</h1>
      <DataTable
        columns={[
          { key: 'name', label: 'Name', render: (r) => r.user?.name },
          { key: 'phone', label: 'Phone', render: (r) => r.user?.phone },
          { key: 'craftType', label: 'Craft Type' },
          { key: 'region', label: 'Region' },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <button onClick={() => approve(r)} style={{ cursor: 'pointer' }}>Approve</button>
            ),
          },
        ]}
        rows={sellers}
      />
    </div>
  );
}
