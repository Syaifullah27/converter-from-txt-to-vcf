import { useState } from 'react';
import axios from 'axios';

function Auth() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? 'http://localhost:3000/api/users/login'
            : 'http://localhost:3000/api/users/register';

        const payload = { email, password };
        if (!isLogin) {
            payload.name = name;
        }

        try {
            const { data } = await axios.post(url, payload);
            console.log('Token:', data.token);
        } catch (err) {
            console.error('Error:', err.response.data.message);
        }
    };

    return (
        <div>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='bg-blue-600' type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button className='bg-blue-600' onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
        </div>
    );
}

export default Auth;
