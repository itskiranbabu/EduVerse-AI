import React from 'react';
import ReactDOM from 'react-dom/client';

// Extend Window interface to allow process.env usage and fix TS error
declare global {
  interface Window {
    process: {
      env: Record<string, string | undefined>;
    };
  }
}

// --- POLYFILL FOR PROCESS.ENV ---
// Critical: This must run before other imports to prevent crashes in the browser
if (typeof window !== 'undefined') {
  window.process = window.process || {};
  window.process.env = window.process.env || {};
  
  // Map Vite env vars to process.env for compatibility
  // @ts-ignore
  if (import.meta && import.meta.env) {
    window.process.env = { 
      ...window.process.env, 
      // @ts-ignore
      ...import.meta.env,
      // @ts-ignore
      API_KEY: import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || ''
    };
  }
}

import App from './App';

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