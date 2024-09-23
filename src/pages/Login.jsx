import { useState } from 'react';
import { login } from '../controllers/authController';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            alert('Login berhasil');
        } catch (err) {
            setError('Email atau password salah');
            console.log(err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                />
                <button type="submit" className="w-full p-2 bg-green-500 hover:bg-green-600 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
