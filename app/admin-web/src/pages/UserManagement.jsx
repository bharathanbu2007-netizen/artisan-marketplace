import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  function load() {
    api.get('/admin/users').then(({ data }) => setUsers(data.users)).catch(() => {});
  }

  useEffect(load, []);

  async function toggleActive(user) {
    await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
    load();
  }

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Users</h1>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'role', label: 'Role' },
          { key: 'isActive', label: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'active' : 'rejected'} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <button onClick={() => toggleActive(r)} style={{ cursor: 'pointer' }}>
                {r.isActive ? 'Deactivate' : 'Activate'}
              </button>
            ),
          },
        ]}
        rows={users}
      />
    </div>
  );
}
