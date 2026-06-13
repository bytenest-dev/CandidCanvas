import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import emailjs from '@emailjs/browser'
import './index.css'
import App from './App.tsx'

// Initialize EmailJS globally — only publicKey needed in browser SDK
emailjs.init({ 
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
