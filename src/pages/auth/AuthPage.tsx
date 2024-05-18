import React from 'react';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь можно добавить логику для обработки отправки формы аутентификации
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Войти</h2>
        <label className="error-message">{message}</label>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Эл. почта</label><br />
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