import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import emailjs from '@emailjs/browser'
import './index.css'
import App from './App.tsx'

// Initialize EmailJS globally
emailjs.init({ 
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  privateKey: import.meta.env.VITE_EMAILJS_PRIVATE_KEY,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
