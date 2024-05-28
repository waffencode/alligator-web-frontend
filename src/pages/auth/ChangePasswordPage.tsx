import React, {useContext} from 'react';
import './AuthPage.css';
import ApiContext from "../../features/api-context";

const ChangePasswordPage: React.FC = () => {
    const {api} = useContext(ApiContext)

    const [oldPassword, setOldPassword] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repPassword, setRepPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    const errorMessageText: string = "Неправильный email или пароль";
    const errorMessageTextNotEqual: string = "Пароли не совпадают";

    const token = localStorage.getItem('token');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(''); // Сброс сообщения об ошибке перед отправкой
        if (password !== repPassword) {
            setMessage(errorMessageTextNotEqual);
        } else {
            try {
                const response = await api.user.changePassword(oldPassword, password);
                //localStorage.setItem('token', response.toString()); // Сохранение токена в локальное хранилище
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
        }
    };


    return (
        <div className="container">
            <div className="form-container">
                <h2>Смена пароля</h2>
                {message && <label className="error-message">{message}</label>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="oldPassword">Старый пароль</label><br />
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
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
                        <label htmlFor="repPassword">Подтверждение пароля</label><br />
                        <input
                            type="password"
                            id="repPassword"
                            value={repPassword}
                            onChange={(e) => setRepPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Отправить</button><br />
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;