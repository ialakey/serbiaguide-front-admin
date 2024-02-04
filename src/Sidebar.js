// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Serbia Guide</h2>
      <ul>
        <li><Link to="/locations">Location</Link></li>
        <li><Link to="/tgchats">TgChat</Link></li>
        <li><Link to="/guideitems">GuideItem</Link></li>
        <li><Link to="/guide">Guide</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
