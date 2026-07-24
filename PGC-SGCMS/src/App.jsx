// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import AppRoutes         from './routes/AppRoutes';
import './index.css';

// Preload critical large assets globally to eliminate navigation paint delay
import principalImg from './assets/principal.png';
import logoImg from './assets/logo.png';
import heroBg from './assets/hero-bg.jpg';

const pImg = new Image();
pImg.src = principalImg;

const lImg = new Image();
lImg.src = logoImg;

const hBg = new Image();
hBg.src = heroBg;

// Global beforeinstallprompt stasher for PWA In-App install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPWAEvent = e;
  window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
});

window.addEventListener('appinstalled', () => {
  window.deferredPWAEvent = null;
  window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
});

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
