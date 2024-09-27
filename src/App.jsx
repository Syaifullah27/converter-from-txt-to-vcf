/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './home';
import Login from './pages/login';
import Register from './pages/Register';
import SuccessPayment from './pages/successPayment';


const App = () => {


  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/success" element={<SuccessPayment />} />
    </Routes>
  </Router>
  )
}

export default App
