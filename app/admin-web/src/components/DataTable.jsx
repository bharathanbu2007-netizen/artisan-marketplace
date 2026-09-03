import React from 'react';

export default function DataTable({ columns, rows, rowKey = '_id' }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={styles.th}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} style={styles.empty}>No records</td>
          </tr>
        )}
        {rows.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((col) => (
              <td key={col.key} style={styles.td}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' },
  th: { textAlign: 'left', padding: '12px 16px', background: '#FFF8F0', borderBottom: '1px solid #EBDFCF', fontSize: 13, color: '#8A7A6D' },
  td: { padding: '12px 16px', borderBottom: '1px solid #EBDFCF', fontSize: 14, color: '#2B2118' },
  empty: { padding: 24, textAlign: 'center', color: '#8A7A6D' },
};
