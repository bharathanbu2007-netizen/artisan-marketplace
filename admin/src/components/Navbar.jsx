import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h2>{title}</h2>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
