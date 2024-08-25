/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import './App.css';
import AdminNavyMember from './ADMIN-NAVY(1file)-MEMBER(1file)'
import OnlyNumber from './Basic-OnlyNumber';
import Navbar from './components/Navbar';
import CustomKeywords from './custom-keywords';
import OpsionalKeywordAndContact from './opsional-keyword-and-contact';
import OnlyNumberWithAAA from './onlyNumber-with-AAA';


const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className={`App ${isDarkMode ? 'bg-black' : ''}`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      <div className='flex gap-4 max-sm:flex-col flex-wrap p-5'>
        {/* <AdminNavyMember /> */}
        {/* <OnlyNumber /> */}
        {/* <CustomKeywords /> */}
        <OpsionalKeywordAndContact isDarkMode={isDarkMode}/>
        <OnlyNumberWithAAA isDarkMode={isDarkMode}/>
      </div>
    </div>
  )
}

export default App
