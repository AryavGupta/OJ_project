import { Route, Routes, Navigate } from 'react-router-dom'
import { useState, useContext } from 'react'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './context/AuthContext'

import './App.css'


function App() {
  // const [count, setCount] = useState(0)
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/register" element={<Register />} /> */}

    </Routes>
  );
}

export default App;
