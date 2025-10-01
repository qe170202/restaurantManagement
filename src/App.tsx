import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// Removed legacy pages: Tables, Payment
import WaiterPage from './pages/WaiterPage';
// TableManagement removed; using WaiterPage instead   

import './App.css';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 280 }}>
                  <Dashboard />
                </Content>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/waiter" element={
            <ProtectedRoute requiredRole="waiter">
              <WaiterPage />
            </ProtectedRoute>
          } />
          
         
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
