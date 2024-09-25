import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

export const register = async (username, email, password) => {
    return await axios.post(`${API_URL}/register`, { username, email, password });
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });

        // Ambil user dan token dari respons API
        const user = response.data.user;
        console.log('Response login:', response.data);

        return user; // Kembalikan objek user yang berisi username
    } catch (error) {
        console.error('Error in login:', error);
        throw error;
    }
};