
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
import { useNavigate } from 'react-router-dom';

const AvaliableTeamsPage: React.FC = () => {
       
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const navigate = useNavigate(); 

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
/*
    const teams: Team[] = [
        { id: '1', name: 'Codebreakers', participants: 5 },
        { id: '2', name: 'Команда2', participants: 8 },
        { id: '3', name: 'Команда3', participants: 4 },
    ];*/

    return (
        <div className="avaliable-teams-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="teams-content">
                <h1>Доступные команды</h1>
                {error ? (<div className="error-message">{error}</div>) : ('')}
                <div className="teams-list">
                    {teams.map((team) => (
                        <div key={team.id} className="team-tile">
                            <div className="team-info">
                                <h2>{team.name}</h2>
                                <p>{team.memberCount} участников</p>
                            </div>
                            <button className="navigate-button" onClick={() => navigate('/teams/${team.id}')}>Перейти</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvaliableTeamsPage;
