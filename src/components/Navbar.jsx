// Navbar.jsx
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import SubscriptionModal from './SubscribeForm';
import './subcribeBtn.css';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Cek status login
    const [username, setUsername] = useState(''); // Menyimpan username dari localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        // Ambil token dan username dari localStorage
        const token = localStorage.getItem('tokenLoginVCF');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername); // Set username ke state
        }

        // Cek apakah user sudah berlangganan
        const subscriptionStatus = localStorage.getItem('isSubscribed');
        if (subscriptionStatus === 'true') {
            setIsSubscribed(true);
        }
    }, []);

    const toggleModal = () => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect ke halaman login jika belum login
        } else {
            setModalOpen(!isModalOpen);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    };

    const handleAuthAction = () => {
        if (isLoggedIn) {
            // Logout
            localStorage.removeItem('tokenLoginVCF');
            localStorage.removeItem('username');
            setIsLoggedIn(false);
            setUsername('');
            setIsSubscribed(false);
            navigate('/login');
        } else {
            // Login
            navigate('/login');
        }
    };

    const handleSubscribe = () => {
        setIsSubscribed(true);
        setModalOpen(false);
        localStorage.setItem('isSubscribed', 'true');
    };

    return (
        <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-900'}`}>
            <div className="flex justify-between items-center px-4">
                <img src="logo.png" alt="Logo" width={250} />
                <div className="flex gap-5 justify-center items-center">
                    {/* Tampilkan username jika sudah login */}
                    {isLoggedIn && <span className="text-white font-medium text-xl">{username}</span>}

                    <button
                        onClick={handleAuthAction}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                    >
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </button>
                    <button
                        onClick={toggleModal}
                        className={`${
                            isSubscribed ? 'bg-gray-400 italic animate-shine' : 'bg-blue-500 hover:bg-blue-700'
                        } text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out`}
                    >
                        {isSubscribed ? 'Premium' : 'Berlangganan'}
                    </button>
                    <Switch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        className={`${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}
                        relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span
                            className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                            inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                    </Switch>
                </div>
            </div>
            {isModalOpen && (
                <SubscriptionModal
                    onClose={() => setModalOpen(false)}
                    onSubscribe={handleSubscribe}
                />
            )}
        </div>
    );
};

export default Navbar;
