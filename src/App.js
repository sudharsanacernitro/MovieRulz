import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/login/login';
import Sign_up from './components/sign_up/signup';
import Main from './components/main/main';
import Sub_main from './components/sub_main/sub_main';
import Chatbot from './components/chatbot/chatbot';
import Watch_later from './components/watch_later/main';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign_up" element={<Sign_up />} />
          <Route path="/" element={<Main />} />
          <Route path="/sub_main" element={<Sub_main />} />
          <Route path="/recommend" element={<Chatbot />} />
          <Route path="/watch_later" element={<Watch_later />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
