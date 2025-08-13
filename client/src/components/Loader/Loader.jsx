import React from 'react';
import './Loader.css';

const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-overlay">
    <div>
      <div className="loader"></div>
      <div className="loader-text">{text}</div>
    </div>
  </div>
);

export default Loader;

