import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Picture from './pages/picture';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
    <Picture purity="100" />
  );
