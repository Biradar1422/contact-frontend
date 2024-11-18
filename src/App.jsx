import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Contacts from './pages/Contacts';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path='/' element={<h1>Home Page</h1>} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Register />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
