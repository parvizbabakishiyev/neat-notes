import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

function calculateVh() {
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  const prevValHeight =
    Number(document.documentElement.style.getPropertyValue('--vh').replace('px', '')) || viewportHeight;

  // check if height changed by visual keyboard and ignore it, Chrome fires resize event when keyboard appears
  if (Math.abs(prevValHeight - viewportHeight) < 200) {
    document.documentElement.style.setProperty('--vh', viewportHeight + 'px');
  }

  document.documentElement.style.setProperty('--vw', viewportWidth + 'px');
}

calculateVh();

window.addEventListener('resize', calculateVh);

window.addEventListener('orientationchange', calculateVh);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
