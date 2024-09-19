/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import OnlyNumberWithAAA from './onlyNumber-with-AAA';
import AutoDetecKeyword from './opsional-keyword-and-contact';


const Home = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);


    return (
        <div className={`App ${isDarkMode ? 'bg-black' : ''}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            {/* <Auth /> */}
            <div className='flex gap-4 max-sm:flex-col flex-wrap p-5'>
                {/* <AdminNavyMember /> */}
                {/* <OnlyNumber /> */}
                {/* <CustomKeywords /> */}
                <AutoDetecKeyword isDarkMode={isDarkMode} />
                <OnlyNumberWithAAA isDarkMode={isDarkMode} />
            </div>

        </div>
    )
}

export default Home
