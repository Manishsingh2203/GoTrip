import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TripProvider } from './context/TripContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import { ModalProvider } from './context/ModalContext'   // ⭐ ADD THIS

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TripProvider>
            <ModalProvider>      {/* ⭐ WRAP IT HERE */}
              <AppRoutes />
            </ModalProvider>
          </TripProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
