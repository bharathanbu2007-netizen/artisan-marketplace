import React from 'react';

const COLOR_MAP = {
  active: '#2E7D32',
  pending_review: '#B5651D',
  rejected: '#B3261E',
  placed: '#8A7A6D',
  confirmed: '#4A7C59',
  shipped: '#B5651D',
  delivered: '#2E7D32',
  cancelled: '#B3261E',
};

export default function StatusBadge({ status }) {
  const color = COLOR_MAP[status] || '#8A7A6D';
  return (
    <span style={{ ...styles.badge, color, borderColor: color }}>
      {String(status).replace('_', ' ')}
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
};
