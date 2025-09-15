// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login1';
import UserManagement from './components/UserManagement';
import GroupManagement from './components/GroupManagement';
import Dashboard from './components/Dashboard';
import './styling.css';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/groups" element={<GroupManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;