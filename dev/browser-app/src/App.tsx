import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


import LoginPage from './components/loginPage.component';
import NavBar from './components/navbar.component';

const App = () => {
  return (
    <Router>
      <NavBar logged_in={ true } />
      <div className="body-container" >
        <Routes>
          <Route path="/" element={ <p>This is the index.</p> } />
          <Route path="/login" element={ <LoginPage /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
