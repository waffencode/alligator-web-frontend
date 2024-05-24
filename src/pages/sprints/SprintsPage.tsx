import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './SprintsPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { getCurUserProfileInfo } from '../../shared/api';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';

const SprintsPage: React.FC = () => {
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
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
                <h1>Спринты пользователя</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="profile-info">        
                    
                </div>
            </div>
        </div>
    );
};

export default SprintsPage;