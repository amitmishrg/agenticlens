import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/styles/tailwind.css';
import { applyThemeToDocument, getStoredTheme } from '@/store/useThemeStore';

applyThemeToDocument(getStoredTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
