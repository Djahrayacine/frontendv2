// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessiblePages');
    window.location.href = '/login';
  };

  return (
    <div>
      <h1>Auth Dashboard</h1>
      <nav>
        <Link to="/users">Manage Users</Link>
        <Link to="/groups">Manage Groups</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;