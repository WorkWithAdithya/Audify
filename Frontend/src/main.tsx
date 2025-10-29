import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { SongProvider } from './context/SongContext.tsx'
import { PaymentProvider } from './context/PaymentContext.tsx'
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <SongProvider>
        <PaymentProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </PaymentProvider>
      </SongProvider>
    </UserProvider>
  </StrictMode>,
)