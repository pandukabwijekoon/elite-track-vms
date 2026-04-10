import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (to be created)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ServiceHistory from './pages/ServiceHistory';
import Modifications from './pages/Modifications';
import Marketplace from './pages/Marketplace';
import CostCalculator from './pages/CostCalculator';
import Glovebox from './pages/Glovebox';
import EliteBot from './components/EliteBot'; // AI Assistant Component

// Global Styles
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <EliteBot />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services" 
            element={
              <ProtectedRoute>
                <ServiceHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/modifications" 
            element={
              <ProtectedRoute>
                <Modifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/costs" 
            element={
              <ProtectedRoute>
                <CostCalculator />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/glovebox" 
            element={
              <ProtectedRoute>
                <Glovebox />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
