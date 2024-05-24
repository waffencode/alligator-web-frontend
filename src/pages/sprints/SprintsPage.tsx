import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './SprintsPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { getSprintsByUserId } from '../../shared/api';
import { Sprint } from '../../shared/api/IResponses';
import { format } from 'date-fns';

const SprintsPage: React.FC = () => {
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const [sprints, setSprints] = useState<Sprint[]>([]);;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getSprintsByUserId(token).
            then((sprints) => {
                setSprints(sprints);
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
    const sprints = [
        { name: 'Sprint 1', team: 'Sprint 1', scrumMaster: 'Scrum', startTime: '06-11-2024', endTime: '07-01-2024', sp: '12', state: 'ACTIVE', onClick: () => {} },
        { name: 'Sprint 2', team: 'Sprint 2', scrumMaster: 'Master', startTime: '66.44.44', endTime: '58.66.44', sp: '15', state: 'ACTIVE', onClick: () => {} },
        { name: 'Sprint 3', team: 'Sprint 3', scrumMaster: 'Scam', startTime: '456.454.4', endTime: '456.13.2', sp: '43', state: 'ACTIVE', onClick: () => {} },
      ];
*/
    return (
        <div className="profile-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="profile-content">
                <h1>Спринты пользователя</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="profile-info">  
               {/* /////////////////////////////////////////////////////////////////////////////////// */}
               <div className="sprints-grid">
                    <div className="sprints-grid-header">
                        <div>Название</div>
                        <div>Команда</div>
                        <div>Scrum-мастер</div>
                        <div>Начало</div>
                        <div>Конец</div>
                        <div>SP</div>
                        <div>Статус</div>
                    </div>
                    {sprints.map((sprint, index) => (
                        <div key={index} className="sprint-tile"onClick={() => {}}>
                            <div>{sprint.name}</div>
                            <div>{sprint.team.name}</div>
                            <div>{sprint.scrumMaster.user.username}</div>
                            <div>{format(new Date(sprint.startTime), 'dd.MM.yyyy')}</div>
                            <div>{format(new Date(sprint.endTime), 'dd.MM.yyyy')}</div>
                            <div>{sprint.sp}</div>
                            <div>{sprint.state}</div>
                        </div>
                    ))}
                </div>
                {/* /////////////////////////////////////////////////////////////////////////////////// */}
                    
                </div>
            </div>
        </div>
    );
};

export default SprintsPage;