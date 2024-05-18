import React from 'react';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const errorMessageText: string = "Неправильный email или пароль";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); // Сброс сообщения об ошибке перед отправкой

    try {
      const response = await fetch('http://194.87.234.28:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        if (response.status === 409) {
          setMessage('Неправильный email или пароль');
        } else {
          setMessage('Ошибка при аутентификации. Попробуйте еще раз.');
        }
      } else {
        const token = await response.text();
        // Сохранение токена и редирект на защищенную страницу
        localStorage.setItem('token', token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setMessage('Ошибка при аутентификации. Попробуйте еще раз.');
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
          <a className="link" href="#">Забыли пароль?</a><br />
          <button type="submit" className="submit-button">Вход</button><br />
          <a className="link" href="#">Нет учётной записи? Зарегистрироваться...</a><br />
        </form>
      </div>
    </div>
  );
};

export default AuthPage;