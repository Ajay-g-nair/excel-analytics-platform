import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis'; // <-- Import the new page

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          {/* This is the new route for the analysis page */}
          <Route path="/analysis/:fileId" element={<Analysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;