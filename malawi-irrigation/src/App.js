import './App.css';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Report from './Pages/Report';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>          
    </div>
  );
}

export default App;
