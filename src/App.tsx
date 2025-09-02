// App.tsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import TableDetail from './pages/TableDetail';
import LoginPage from './pages/Login/page';
import DashboardPage from './pages/DashboardPage';
import { useAuthStore } from './store/useAuthStore';
import { Loading } from './components/loading';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useEffect } from 'react';

function App() {
  const { isLoading } = useAuthStore();
  // App.tsx - tambahkan ini
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Forcing isLoading to false");
        useAuthStore.setState({ isLoading: false });
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />

      <Route path="/table/:id" element={
        <ProtectedRoute>
          <TableDetail />
        </ProtectedRoute>} 
      />

      {/* Hanya Pelayan */}
      <Route
        path="/menus"
        element={<ProtectedRoute roles={["Pelayan"]}><DashboardPage /></ProtectedRoute>}
      />

      {/* Hanya Kasir */}
      <Route
        path="/receipt/:id"
        element={<ProtectedRoute roles={["Kasir"]}><TableDetail /></ProtectedRoute>}
      />
    </Routes>
  );
}

export default App;