import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Don't worry if this file is blank or missing, React just likes it here
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);