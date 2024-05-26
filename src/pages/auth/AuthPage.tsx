import React, {useContext} from 'react';
import './AuthPage.css';
import ApiContext from "../../features/api-context";
import {AuthenticationContextData} from "../../shared/lib/token";
import {useNavigate} from "react-router-dom";
import {RoutePaths} from "../../shared/config/routes";

const AuthPage: React.FC = () => {
    const { api, setAuthentication, resetAuthentication } = useContext(ApiContext);
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const errorMessageText: string = "Неправильный email или пароль";

    const _fetchAuthenticationContextDataByToken = (token:string) => {
        return fetch("http://localhost:8080/whoami", {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => ({
                username: data.username,
                id: data.id,
                roles: data.roles
            }))
            .catch(error => {
                console.error('Failed to fetch user data:', error);
                return null;
            });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(''); // Сброс сообщения об ошибке перед отправкой

        try {
          const tokenResponse = await api.auth.login(username, password);
          const token = tokenResponse.toString();

          const authData = await _fetchAuthenticationContextDataByToken(token);

          const authenticationContext = new AuthenticationContextData(
              token,
              authData?.username,
              authData?.id,
              authData?.roles
          );

          console.log(authenticationContext);

          setAuthentication(authenticationContext);

          navigate(RoutePaths.profile);
      } catch (error) {
          if (error instanceof Error) {
              const [status, errorMessage] = error.message.split(': ', 2);
              if (status === '409') {
                  setMessage('Неправильный email или пароль.');
              } else {
                  setMessage('Ошибка при аутентификации. Попробуйте еще раз.');
                  setMessage(`Ошибка ${status}: ${errorMessage}`);
              }
          } else {
              setMessage('Неизвестная ошибка. Попробуйте еще раз.');
          }
      }
    };


    return (
        <div className="container">
            <div className="form-container">
                <h2>Войти</h2>
                <label className="error-message">{message}</label>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Email</label><br />
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Пароль</label><br />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <a className="link" href="/forgetpassword">Забыли пароль?</a><br />
                    <button type="submit" className="submit-button">Вход</button><br />
                    <a className="link" href="/register">Нет учётной записи? Зарегистрироваться...</a><br />
                </form>
            </div>
        </div>
    );
};

export default AuthPage;