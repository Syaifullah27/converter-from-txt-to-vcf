/* eslint-disable no-unused-vars */
import React from 'react'
import './App.css';
import AdminNavyMember from './ADMIN-NAVY(1file)-MEMBER(1file)'
import OnlyNumber from './Basic-OnlyNumber';
import Navbar from './components/Navbar';
import CustomKeywords from './custom-keywords';
import OpsionalKeywordAndContact from './opsional-keyword-and-contact';

const App = () => {
  return (
    <>
      <Navbar />
      <div className='flex gap-4 max-sm:flex-col flex-wrap p-5'>
        <AdminNavyMember />
        <OnlyNumber />
        <CustomKeywords />
        <OpsionalKeywordAndContact />
      </div>
    </>
  )
}

export default App
