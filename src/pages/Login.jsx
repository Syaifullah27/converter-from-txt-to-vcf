import { useState } from 'react';
import { login } from '../api/auth'; // Menggunakan API login dari auth.js
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await login(email, password);
            setSuccess(true);
            localStorage.setItem('tokenLoginVCF', 'true');
            setTimeout(() => {
                navigate('/'); // Redirect ke halaman home atau halaman lain yang diinginkan setelah login
            }, 2000);
        } catch (error) {
            setError('Login failed. Please check your email and password.');
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-dark-bg text-white">
            <form onSubmit={handleSubmit} className="bg-glow p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Menampilkan pesan error jika ada */}
                {success && <p className="text-green-500 mb-4">Login successful! Redirecting...</p>} {/* Menampilkan pesan sukses */}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Password"
                />
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                    Login
                </button>
            </form>

            <div className="text-center mt-4">
                <p>
                    Don&apos;t have an account?{' '}
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
