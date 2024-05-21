
import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './AvaliableTeamsPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import appsIcon from '../../shared/ui/icons/apps.png';
import profileIcon from '../../shared/ui/icons/profile.png';
import sprintIcon from '../../shared/ui/icons/sprint.png';
import { getCurUserProfileInfo } from '../../shared/api';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';

const AvaliableTeamsPage: React.FC = () => {
       
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню

    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getCurUserProfileInfo(token)
                .then((profile) => {
                    setFullName(profile.fullName);
                    //setRole(profile.role); 
                    // TODO: получение ролей
                    setPhone(profile.phone_number);
                    setEmail(profile.email);
                })
                .catch((err) => {
                    console.error('Failed to fetch user profile', err);
                    setError('Failed to load user profile');
                });
        } else {
            setError('No authentication token found');
        }
    }, []);

    return (
        <div className="profile-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="profile-content">
                <h1>Доступные команды</h1>
                {error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="profile-info">
                        <div className="profile-info-row">
                            <label>ФИО:</label><span>{fullName}</span>
                        </div>
                        <div className="profile-info-row">
                            <label>Основная роль:</label><span>{role}</span>
                        </div>
                        <div className="profile-info-row">
                            <label>Email:</label><span>{email}</span>
                        </div>
                        <div className="profile-info-row">
                            <label>Номер телефона:</label><span>{phone}</span>
                        </div>
                        <div className="profile-info-row">
                            <label>Смена пароля:</label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvaliableTeamsPage;
