/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './App.css';
// import AdminNavyMember from './ADMIN-NAVY(1file)-MEMBER(1file)'
// import OnlyNumber from './Basic-OnlyNumber';
import Navbar from './components/Navbar';
// import CustomKeywords from './custom-keywords';
import OnlyNumberWithAAA from './onlyNumber-with-AAA';
import AutoDetecKeyword from './opsional-keyword-and-contact';


const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);


  return (
    <div className={`App ${isDarkMode ? 'bg-black' : ''}`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      <div className='flex gap-4 max-sm:flex-col flex-wrap p-5'>
        {/* <AdminNavyMember /> */}
        {/* <OnlyNumber /> */}
        {/* <CustomKeywords /> */}
        <AutoDetecKeyword isDarkMode={isDarkMode}/>
        <OnlyNumberWithAAA isDarkMode={isDarkMode}/>
      </div>

    </div>
  )
}

export default App
