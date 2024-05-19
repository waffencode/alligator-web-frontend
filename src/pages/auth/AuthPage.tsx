import React from 'react';
import './AuthPage.css';
import { login } from '../../shared/api/index';

const AuthPage: React.FC = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const errorMessageText: string = "Неправильный email или пароль";

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(''); // Сброс сообщения об ошибке перед отправкой

        try {
          const response = await login(username, password);
          localStorage.setItem('token', response.token); // Сохранение токена в локальное хранилище
          //window.location.href = '/profile'; // Перенаправление на защищенную страницу
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