// Safeguard against "TypeError: Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let activeFetch = rawFetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => activeFetch,
      set: (val) => {
        activeFetch = typeof val === 'function' ? val : rawFetch;
      }
    });
  } catch {}
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
