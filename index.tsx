import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Additional safety mapping in case window.process is used later
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.process = window.process || { env: {} };
  // @ts-ignore
  if (import.meta && import.meta.env) {
    // @ts-ignore
    window.process.env = { ...window.process.env, ...import.meta.env };
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);