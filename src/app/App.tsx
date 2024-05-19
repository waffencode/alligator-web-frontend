import React from 'react';
import AuthPage from '../pages/auth/AuthPage';
import RegisterPage from '../pages/auth/RegisterPage';
import Profile from '../pages/profile/Profile';

import AppRoutes from '../pages/AppRoutes';

const App: React.FC = () => {
  return (
    <div>
      <React.StrictMode>
        <AppRoutes />
      </React.StrictMode>
    </div>
  );
}

export default App;
