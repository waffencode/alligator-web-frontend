import React, { useContext, useEffect, useState } from 'react';
import './SprintsPage.css';
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

    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingSprintId, setEditingSprintId] = useState<number | null>(null);
    const [editedSprint, setEditedSprint] = useState<Sprint | null>(null);
    const [isAddingNewSprint, setIsAddingNewSprint] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.sprint.getSprints()
                .then((sprints) => {
                    setSprints(sprints);
                })
                .catch((err) => {
                    console.error('Failed to fetch sprints', err);
                    setError('Failed to load sprints');
                });
        } else {
            setError('No authentication token found');
        }
    }, [api.sprint]);

    const handleAddNewSprint = () => {
        setIsAddingNewSprint(true);
    };

    const handleEditClick = (sprint: Sprint) => {
        if (editingSprintId === sprint.id) {
            if (editedSprint) {
                const token = localStorage.getItem('token');
                if (token) {
                    api.sprint.updateSprint(editedSprint)
                        .then(() => {
                            setSprints(sprints.map(s => s.id === editedSprint.id ? editedSprint : s));
                            setEditingSprintId(null);
                            setEditedSprint(null);
                        })
                        .catch((err) => {
                            console.error('Failed to update sprint', err);
                            setError('Failed to update sprint');
                        });
                }
            }
        } else {
            setEditingSprintId(sprint.id);
            setEditedSprint({ ...sprint });
        }
    };

    const handleSprintChange = (field: keyof Sprint, value: string | number) => {
        if (editedSprint) {
            if (field === 'startTime' || field === 'endTime') {
                const editedDeadlineTime = new Date(value);
                setEditedSprint({ ...editedSprint, [field]: editedDeadlineTime.toISOString() });
            } else {
                setEditedSprint({ ...editedSprint, [field]: value });
            }
        }
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список спринтов" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.backlog} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile-info">
                        <div className="sprints-grid">
                            <div className="sprints-grid-header">
                                <div>Редактировать</div>
                                <div>Название</div>
                                <div>Команда</div>
                                <div>Scrum-мастер</div>
                                <div>Начало</div>
                                <div>Конец</div>
                                <div>SP</div>
                                <div>Задачи</div>
                            </div>
                            {sprints.map((sprint, index) => (
                                <div key={index} className="sprint-tile">
                                    <div className="edit_button_container">
                                        <button
                                            className="edit_button"
                                            onClick={() => handleEditClick(sprint)}
                                        >
                                            {editingSprintId === sprint.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {editingSprintId === sprint.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedSprint?.name || ''}
                                                onChange={(e) => handleSprintChange('name', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={editedSprint?.team_name || ''}
                                                onChange={(e) => handleSprintChange('team_name', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={editedSprint?.scrumMaster_fullName || ''}
                                                onChange={(e) => handleSprintChange('scrumMaster_fullName', e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                value={editedSprint ? format(new Date(editedSprint.startTime), 'yyyy-MM-dd') : ''}
                                                onChange={(e) => handleSprintChange('startTime', e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                value={editedSprint ? format(new Date(editedSprint.endTime), 'yyyy-MM-dd') : ''}
                                                onChange={(e) => handleSprintChange('endTime', e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                value={editedSprint?.sp || 0}
                                                onChange={(e) => handleSprintChange('sp', e.target.value)}
                                            />
                                            <button>Перейти</button>
                                        </>
                                    ) : (
                                        <>
                                            <div>{sprint.name}</div>
                                            <div>{sprint.team_name}</div>
                                            <div>{sprint.scrumMaster_fullName}</div>
                                            <div>{format(new Date(sprint.startTime), 'dd.MM.yyyy')}</div>
                                            <div>{format(new Date(sprint.endTime), 'dd.MM.yyyy')}</div>
                                            <div>{sprint.sp}</div>
                                            <div><button>Перейти</button></div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <button onClick={handleAddNewSprint}>Добавить спринт</button>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default SprintsPage;