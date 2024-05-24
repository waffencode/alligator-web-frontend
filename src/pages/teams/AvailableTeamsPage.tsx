
import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './AvaliableTeamsPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import appsIcon from '../../shared/ui/icons/apps.png';
import profileIcon from '../../shared/ui/icons/profile.png';
import sprintIcon from '../../shared/ui/icons/sprint.png';
import { getTeamsByUserIdWithCountOfMembers } from '../../shared/api';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { Team } from '../../shared/api/IResponses';

const AvaliableTeamsPage: React.FC = () => {
       
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню

    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getTeamsByUserIdWithCountOfMembers(token).
            then((teams) => {
                setTeams(teams);
                //console.log(teams);
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
                {error ? (<div className="error-message">{error}</div>) : ('')}
                <div className="profile-info">
                        
                </div>
            </div>
        </div>
    );
};

export default AvaliableTeamsPage;
