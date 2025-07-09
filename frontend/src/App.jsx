import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

import './App.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddProblem from './pages/AddProblem';
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute';
import EditProblem from './pages/EditProblem';
import ProblemDetail from './pages/ProblemDetail';
import TestCaseManager from './pages/TestCaseManager';

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
      <Route path="/add-problem" element={
        <AdminProtectedRoute>
          <AddProblem />
        </AdminProtectedRoute>
      } />
      <Route path="/edit-problem/:id" element={
        <AdminProtectedRoute>
          <EditProblem />
        </AdminProtectedRoute>
      }
      />
      <Route path="/problem/:id" 
      element = {
        <ProtectedRoute>
          <ProblemDetail />
        </ProtectedRoute>
      }
      />
      <Route path="/manage-testcases/:problemId" element={<TestCaseManager />} />

    </Routes>
  );
}

export default App;
