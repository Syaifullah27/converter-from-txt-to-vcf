/* eslint-disable react/prop-types */
// import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import SubscriptionModal from './SubscribeForm';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
    // const [isDarkMode, setIsDarkMode] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    useEffect(() => {
        // Cek status dark mode dari localStorage
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'enabled') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

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


    return (
        <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-900'}`}>
            <div className="flex justify-between items-center px-4">
                <img src="logo.png" alt="" width={250} />
                {/* <h1 className="text-center text-3xl font-bold text-white">
                EsyehaX Converter
                </h1> */}

                <div className='flex gap-5 justify-center items-center'>
                    <button
                        onClick={toggleModal}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Berlangganan
                    </button>
                    {isModalOpen && <SubscriptionModal onClose={toggleModal} />}
                    <Switch
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        className={`${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'} 
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none`}
                    >
                        <span
                            className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                        />
                    </Switch>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
