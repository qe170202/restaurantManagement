import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Payment from './pages/Payment';
import TableManagement from './pages/TableManagement';
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
              <TableManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 280 }}>
                  <Orders />
                </Content>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/tables" element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 280 }}>
                  <Tables />
                </Content>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/payment" element={
            <ProtectedRoute requiredRole="admin">
              <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 280 }}>
                  <Payment />
                </Content>
              </Layout>
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
