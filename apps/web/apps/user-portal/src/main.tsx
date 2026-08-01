import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import '@shared/index.css';
import './index.css';

async function enableMocking() {
  if (import.meta.env.VITE__USER_PORTAL__MOCK_API !== 'true') return;
  const { startMockWorker } = await import('@shared/mocks/start');
  return startMockWorker();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
