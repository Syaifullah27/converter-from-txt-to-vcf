import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

export const register = async (username, email, password) => {
    return await axios.post(`${API_URL}/register`, { username, email, password });
};

export const login = async (email, password) => {
    return await axios.post(`${API_URL}/login`, { email, password });
};
