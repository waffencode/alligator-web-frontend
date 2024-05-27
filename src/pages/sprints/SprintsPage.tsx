import React, { useContext, useEffect, useState } from 'react';
import './SprintsPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { Sprint } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from '../../widgets/Layout/Layout';
import Content from '../../widgets/Content/Content';
import BrandLogo from '../../widgets/BrandLogo/BrandLogo';
import PageName from '../../widgets/PageName/PageName';
import Sidebar from '../../widgets/SideBar/SideBar';

const SprintsPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [sprints, setSprints] = useState<Sprint[]>([]);;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.sprint.getSprintsOfCurrentUser()
                .then((sprints) => {
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

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список спринтов" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.backlog} />}
            bottomRight={
                <Content>
                    <div className="profile-page">
                        <div className="profile-content">
                            {error && <div className="error-message">{error}</div>}
                            <div className="profile-info">
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
                                        <div key={index} className="sprint-tile" onClick={() => { }}>
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

                            </div>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default SprintsPage;