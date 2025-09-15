// src/components/GroupManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    accessiblePages: []
  });
 const [availablePages] = useState([
    'CoresspondantExtern',
    'Coresspondantinterne', 
    'ChequePage',
    'CourrierArrive',
    'CourrierDepart'
]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/admin/groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/admin/groups', newGroup, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewGroup({ name: '', description: '', accessiblePages: [] });
      fetchGroups();
    } catch (error) {
      alert('Error creating group');
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/admin/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroups();
    } catch (error) {
      alert('Error deleting group');
    }
  };

  const handlePageSelection = (page) => {
    const isSelected = newGroup.accessiblePages.includes(page);
    const updatedPages = isSelected
      ? newGroup.accessiblePages.filter(p => p !== page)
      : [...newGroup.accessiblePages, page];
    
    setNewGroup({...newGroup, accessiblePages: updatedPages});
  };

  return (
    <div>
      <h2>Group Management</h2>
      
      {/* Create Group Form */}
      <form onSubmit={createGroup}>
        <h3>Create New Group</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={newGroup.name}
          onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newGroup.description}
          onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
        />
        
        <div>
          <h4>Accessible Pages:</h4>
          {availablePages.map(page => (
            <label key={page}>
              <input
                type="checkbox"
                checked={newGroup.accessiblePages.includes(page)}
                onChange={() => handlePageSelection(page)}
              />
              {page.replace('_', ' ').toUpperCase()}
            </label>
          ))}
        </div>
        
        <button type="submit">Create Group</button>
      </form>

      {/* Groups List */}
      <h3>Existing Groups</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Accessible Pages</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>{group.description}</td>
              <td>{group.accessiblePages?.join(', ')}</td>
              <td>
                <button onClick={() => deleteGroup(group.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupManagement;