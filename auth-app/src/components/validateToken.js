// src/utils/validateToken.js
import axios from 'axios';

// Always send cookies with requests
axios.defaults.withCredentials = true;

export async function validateToken() {
  try {
    const response = await axios.get('http://localhost:8081/api/auth/validate');
    // Backend returns { valid: true } if token is good
    return response.data?.valid === true;
  } catch (error) {
    return false;
  }
}
