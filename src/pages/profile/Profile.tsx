import React from 'react';
import Sidebar from '../../widgets/Sidebar';
import './Profile.css';

const Profile: React.FC = () => {

    const menuItems = [
        { label: 'Команды', icon: '/icons/user.svg', onClick: () => {}},
        { label: 'Профиль', icon: '/icons/user.svg', onClick: () => {} },
    ];

    const [fullName, setFullname] = React.useState('Иван Иванов');
    const [role, setRole] = React.useState('Разработчик');
    const [phone, setPhone] = React.useState('+7 (999) 999-99-99');
    const [email, setEmail] = React.useState('ivan.ivanov@example.com');

    return (
        <div className="profile-page">
            <Sidebar menuItems={menuItems} />
            <div className="profile-content">
                <h1>Профиль</h1>
                <div className="profile-info">
                    <div className="profile-info-row">
                        <label>ФИО:</label><span>{fullName}</span>
                    </div>
                    <div className="profile-info-row">
                        <label>Основная роль:</label><span>{role}</span>
                    </div>
                    <div className="profile-info-row">
                        <label>Номер телефона:</label><span>{phone}</span>
                    </div>
                    <div className="profile-info-row">
                        <label>Email:</label><span>{email}</span>
                    </div>
                    <div className="profile-info-row">
                        <label>Смена пароля:</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;