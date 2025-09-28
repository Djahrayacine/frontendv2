// src/components/Login1.js
import React, { useState } from 'react';
import axios from 'axios';

// Always send/receive cookies with requests
axios.defaults.withCredentials = true;

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  // Auth server port
  const API_BASE_URL = 'http://localhost:8081';
  // FIXED: Change this to match your exploitation app port
  const EXPLOITATION_APP_URL = 'http://localhost:3001'; // Change from 3001 to 3000

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Login attempt started');
    console.log('Credentials:', credentials);

    try {
      const loginUrl = `${API_BASE_URL}/api/auth/login`;
      console.log('Making request to:', loginUrl);
      
      const response = await axios.post(loginUrl, credentials);
      
      console.log('Response received:', response.data);
      console.log('Login successful!');
      
      // ***** THIS WAS MISSING - STORE THE JWT TOKEN *****
      const { token, accessiblePages, user } = response.data;
      
      if (token) {
        // Store JWT token in cookie
        document.cookie = `token=${token}; path=/; SameSite=Lax; max-age=${7*24*60*60}`;
        console.log('JWT token stored in cookie');
      } else {
        console.error('No token in response!');
        alert('Login failed: No token received');
        return;
      }
      
      // Store accessible pages if provided
      if (accessiblePages) {
        document.cookie = `accessiblePages=${accessiblePages.join ? accessiblePages.join(',') : accessiblePages}; path=/; SameSite=Lax`;
        console.log('Accessible pages stored:', accessiblePages);
      }
      
      // Store user info if provided
      if (user) {
        document.cookie = `user=${JSON.stringify(user)}; path=/; SameSite=Lax`;
        console.log('User info stored:', user);
      }
      // ***** END OF MISSING CODE *****
      
      // Debug: Check if cookies are set
      console.log('Cookies after login:', document.cookie);
      
      console.log(`Redirecting to exploitation app: ${EXPLOITATION_APP_URL}`);
      
      // Small delay to ensure cookies are set before redirect
      setTimeout(() => {
        window.location.href = EXPLOITATION_APP_URL;
      }, 100);

    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 400) {
          alert('Invalid credentials. Please check your username and password.');
        } else {
          alert(`Login failed: ${error.response.data || 'Unknown error'}`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Cannot connect to server. Please check if the server is running.');
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required
            disabled={loading}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password" 
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p>Auth Server: {API_BASE_URL}</p>
        <p>Exploitation App: {EXPLOITATION_APP_URL}</p>
        <p>Test credentials: admin/admin123 (if available)</p>
      </div>
    </div>
  );
};

export default Login;