import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App.tsx';
import './index.css';

// Create root element and render the App component
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
