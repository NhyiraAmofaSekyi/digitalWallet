import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Register from './pages/register.tsx'
import SignIn from './pages/signIn.tsx'
import { useUserWallet } from './hooks/useUserWallet';
import WalletDashboard from './App.tsx'



function Wrapper() {
  const { user } = useUserWallet();


  return (
    <Routes>
      <Route
        path="/"
        element={ user && user != null || undefined ? <WalletDashboard /> : <Navigate to="/signin" />}
      />
      <Route
        path="/register"
        element={ <Register /> }
      />
      <Route
        path="/signin"
        element={ <SignIn />}
      />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Wrapper></Wrapper>
    </Router>
  </StrictMode>,
)

