/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await register(username, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Register</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">Registration successful! Redirecting to login...</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded"
                />
                <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
