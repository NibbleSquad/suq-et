import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- CORRECT
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter wraps the entire App */}
    <BrowserRouter>
      <Toaster/>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);