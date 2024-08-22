/* eslint-disable no-unused-vars */
import React from 'react'
import './App.css';
import AdminNavyMember from './ADMIN-NAVY(1file)-MEMBER(1file)'
import OnlyNumber from './Basic-OnlyNumber';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <div className='flex gap-2'>
        <AdminNavyMember />
        <OnlyNumber />
      </div>
    </>
  )
}

export default App
