/* eslint-disable react/prop-types */
import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import SubscriptionModal from './SubscribeForm';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk redirect

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk mengecek status login
    const navigate = useNavigate(); // Hook untuk navigasi halaman

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }

        // Cek apakah ada token di localStorage
        const token = localStorage.getItem('tokenLoginVCF');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
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

    const handleSubscribe = () => {
        setIsSubscribed(true);
        setModalOpen(false);
    };

    // Fungsi untuk menangani login/logout
    const handleAuthAction = () => {
        if (isLoggedIn) {
            const cofirmation = window.confirm('Are you sure you want to logout?');
            if (cofirmation) {
                // Jika sudah login (ada token), lakukan logout
                localStorage.removeItem('tokenLoginVCF'); // Hapus token
                setIsLoggedIn(false); // Ubah status login jadi false
            }
        } else {
            // Jika belum login, arahkan ke halaman login
            navigate('/login');
        }
    };

    return (
        <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-900'}`}>
            <div className="flex justify-between items-center px-4">
                <img src="logo.png" alt="Logo" width={250} />
                <div className="flex gap-5 justify-center items-center">
                    {/* Tombol Login/Logout */}
                    <button
                        onClick={handleAuthAction}
                        className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                    >
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </button>
                    <button
                        onClick={toggleModal}
                        className={`${
                            isSubscribed ? 'bg-gray-400 italic' : 'bg-blue-500 hover:bg-blue-700'
                        } text-white font-bold py-2 px-4 rounded`}
                    >
                        {isSubscribed ? 'Premium' : 'Berlangganan'}
                    </button>
                    {isModalOpen && (
                        <SubscriptionModal onClose={toggleModal} onSubscribe={handleSubscribe} />
                    )}
                    <Switch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        className={`${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'} 
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none`}
                    >
                        <span
                            className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                        />
                    </Switch>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
