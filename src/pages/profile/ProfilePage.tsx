
import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './ProfilePage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { getCurUserProfileInfo } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { rolesTranslator } from '../../entities/RolesTranslator';

const ProfilePage: React.FC = () => {
   
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const navigate = useNavigate(); // используем useNavigate вместо navigator

    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<string>('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getCurUserProfileInfo(token)
                .then((profile) => {
                    setFullName(profile.fullName);
                    setRole(rolesTranslator(profile.roles)); 
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
                <h1>Профиль</h1>
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
                            <label>Смена пароля:</label><button onClick ={() => navigate("/change-password")}>Сменить пароль</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
