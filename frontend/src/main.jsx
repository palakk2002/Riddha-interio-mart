import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './modules/user/data/CartContext'
import { WishlistProvider } from './modules/user/data/WishlistContext'
import { UserProvider } from './modules/user/data/UserContext'
import { NotificationProvider } from './modules/user/data/NotificationContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
