import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './accounts/signup';
import Login from './accounts/login';
import UserUpdate from './accounts/update';
import Index from './live';
import ViewList from './live/list';

function App() {
  return (
    <div className='App'>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/' element={<Index />}/>
          <Route path='/user' element={<UserUpdate />}/>
          <Route path='/list' element={<ViewList />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
