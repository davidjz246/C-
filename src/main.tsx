import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign ResizeObserver notifications from Monaco Editor layout shifts
if (typeof window !== 'undefined') {
  const resizeObserverErrorHandler = (e: ErrorEvent) => {
    if (
      e.message &&
      (e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
        e.message.includes('ResizeObserver loop limit exceeded'))
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };

  window.addEventListener('error', resizeObserverErrorHandler);
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    if (
      e.reason &&
      typeof e.reason.message === 'string' &&
      (e.reason.message.includes('ResizeObserver loop completed with undelivered notifications') ||
        e.reason.message.includes('ResizeObserver loop limit exceeded'))
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
