import React from 'react';
import AuthPage from '../pages/auth/AuthPage';
import RegisterPage from '../pages/auth/RegisterPage';
import Profile from '../pages/profile/ProfilePage';

import AppRoutes from '../pages/AppRoutes';
import AppRouter from "./AppRouter";
import {BrowserRouter} from "react-router-dom";
import ApiContextProvider from "../widgets/ApiContextProvider/ApiContextProvider";

const App: React.FC = () => {
  return (
    <div>
      <React.StrictMode>
        <BrowserRouter>
            <ApiContextProvider>
                <AppRouter />
            </ApiContextProvider>
        </BrowserRouter>
      </React.StrictMode>
    </div>
  );
}

export default App;
