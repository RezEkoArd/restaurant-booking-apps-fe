// App.tsx
import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/Login/page';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import DetailOrderPage from './pages/DetailOrderPage';


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={<DashboardPage />} 
      />

       {/* Protected Routes - Accessible by both roles */}
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <DetailOrderPage />
          </ProtectedRoute>
        } />

          {/* Routes khusus Pelayan */}
        {/* <Route path="/orders" element={
          <ProtectedRoute requiredRole="elayan">
            <OrderManagement />
          </ProtectedRoute>
        } /> */}

          {/* Routes khusus Kasir */}
        {/* <Route path="/payments" element={
          <ProtectedRoute requiredRole="kasir">
            <PaymentManagement />
          </ProtectedRoute>
        } /> */}
    </Routes>
  );
}

export default App;