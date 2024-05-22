

import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './AvaliableTeamsPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import appsIcon from '../../shared/ui/icons/apps.png';
import profileIcon from '../../shared/ui/icons/profile.png';
import sprintIcon from '../../shared/ui/icons/sprint.png';
import { getCurUserProfileInfo } from '../../shared/api';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';

const SprintsPages: React.FC = () => {
       
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню

    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            
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
                        
                    </div>
                )}
            </div>
        </div>
    );
};



export default { SprintsPages} ;