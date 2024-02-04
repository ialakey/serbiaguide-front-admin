// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import LocationScreen from './screen/LocationScreen';
import TgChatScreen from './screen/TgChatScreen';
import GuideItemScreen from './screen/GuideItemScreen';
import GuideScreen from './screen/GuideScreen';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Routes>
            <Route path="/locations" element={<LocationScreen />} />
            <Route path="/tgchats" element={<TgChatScreen />} />
            <Route path="/guideitems" element={<GuideItemScreen />} />
            <Route path="/guide" element={<GuideScreen />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;