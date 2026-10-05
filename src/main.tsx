import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { store } from './lib/storage';

// Returning from Stripe Payment Link / Checkout / Gumroad: ?checkout=success unlocks Pro.
// NOTE: client-side honour system for the MVP — see README "Known gaps".
const params = new URLSearchParams(window.location.search);
if (params.get('checkout') === 'success') {
  store.setPro(true);
  window.history.replaceState(null, '', window.location.pathname + '#/upgrade/success');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
