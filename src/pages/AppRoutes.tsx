import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import RegisterPage from './auth/RegisterPage';
import Profile from './profile/Profile';

const AppRoutes: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // или любой другой компонент, который вы хотите отобразить во время загрузки
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/profile" 
          element={token ? <Profile /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={token ? "/profile" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;