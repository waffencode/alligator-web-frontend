import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import RegisterPage from './auth/RegisterPage';
import ProfilePage from './profile/ProfilePage';
import AvaliableTeamsPage from './teams/AvailableTeamsPage';
import ChangePasswordPage from './auth/ChangePasswordPage';
import SprintsPage from './sprints/SprintsPage';

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
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route 
          path="/profile" 
          element={token ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={token ? "/profile" : "/login"} replace />} 
        />
        <Route path="/available-teams" element={<AvaliableTeamsPage />} />
        <Route path="/sprints" element={<SprintsPage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;