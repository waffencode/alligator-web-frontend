import React from 'react';
import './AuthPage.css';
import { register } from '../../shared/api/index';

const RegisterPage: React.FC = () => {
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repPassword, setRepPassword] = React.useState('');

    const emailErrorMessageText: string = "Неправильный email";
    const errorMessageTextNotEqual: string = "Пароли не совпадают";


    const handleRegisterSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(''); // Сброс сообщения об ошибке перед отправкой

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            setMessage(emailErrorMessageText);
        } else if (password !== repPassword) {
            setMessage(errorMessageTextNotEqual);
        } else {
            try {
                const response = await register(username, password, name+" "+surname, username, phone); // Получение AuthResponse из функции register
                localStorage.setItem('token', response.toString()); // Сохранение токена в локальное хранилище
                window.location.href = '/profile'; // Перенаправление на защищенную страницу
            } catch (error) {
                if (error instanceof Error) {
                    const [status, errorMessage] = error.message.split(': ', 2);
                    if ( errorMessage === '{"message":"Username ' + username + ' already exists"}') {
                        setMessage('Пользователь с таким email уже существует.');
                    } else {
                        setMessage(`Ошибка ${status}: ${errorMessage}`);
                    }
                } else {
                    setMessage('Неизвестная ошибка. Попробуйте еще раз.');
                }
            }
        }        
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Регистрация</h2>
                <label className="error-message">{message}</label>
                <form onSubmit={handleRegisterSubmit}>
                    <div className="input-group">
                        <label>Имя</label><br />
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Фамилия</label><br />
                        <input
                            type="text"
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Телефон</label><br />
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="input-group">
                        <label htmlFor="password">Повторите пароль</label><br />
                        <input
                            type="password"
                            id="rep-password"
                            value={repPassword}
                            onChange={(e) => setRepPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Регистрация</button><br />
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;