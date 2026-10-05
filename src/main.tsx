import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { claimCheckoutSuccess } from './lib/billing';

// Returning from Stripe Payment Link / Checkout / Gumroad with ?checkout=success.
// Only honoured when real checkout is configured AND this browser started a checkout recently
// (see claimCheckoutSuccess). Still client-side only, not real payment verification; see README "Known gaps".
const params = new URLSearchParams(window.location.search);
if (params.get('checkout') === 'success') {
  const ok = claimCheckoutSuccess(params.get('session_id'));
  window.history.replaceState(null, '', window.location.pathname + (ok ? '#/upgrade/success' : '#/upgrade/unverified'));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
