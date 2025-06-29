import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>

      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />

    </Routes>
  );
}

export default App;
