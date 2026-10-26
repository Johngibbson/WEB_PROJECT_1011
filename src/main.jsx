import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './styles/style.css';

// Entry point: mounts the React app into <div id="root"> in index.html.
// HashRouter keeps the route after "#" (e.g. /#/pets), so refreshing never gives a 404 on static hosting.
// The "future" flags opt in to React Router v7 behaviour and silence its console warnings.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
);
