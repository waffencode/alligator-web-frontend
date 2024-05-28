import React, { useContext, useEffect, useState } from 'react';
import './SprintsPage.css';
import { Sprint, Team, UserInfo_TeamMember } from '../../shared/api/IResponses';
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
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamMembers, setTeamMembers] = useState<UserInfo_TeamMember[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingSprintId, setEditingSprintId] = useState<number | null>(null);
    const [editedSprint, setEditedSprint] = useState<Sprint | null>(null);
    const [isAddingNewSprint, setIsAddingNewSprint] = useState<boolean>(false);
    const [newSprint, setNewSprint] = useState<Sprint>({
        id: 0,
        name: '',
        startTime: format(new Date(new Date().getTime()), 'yyyy-MM-dd'),
        endTime: format(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        sp: 100,
        state: 'ACTIVE',
        team_id: 0,
        team_name: '',
        scrumMaster_id: 0,
        scrumMaster_fullName: '',
    });

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

            api.team.getTeams()
                .then((teams) => {
                    setTeams(teams);
                })
                .catch((err) => {
                    console.error('Failed to fetch teams', err);
                    setError('Failed to load teams');
                });
        } else {
            setError('No authentication token found');
        }
    }, [api.sprint, api.team]);

    const handleAddNewSprint = () => {
        setIsAddingNewSprint(true);
    };

    const handleEditClick = (sprint: Sprint) => {
        if (editingSprintId === sprint.id) {
            if (editedSprint) {
                if (!editedSprint.team_id) {
                    setError('Выберите команду');
                    return;
                }

                if (!editedSprint.scrumMaster_id) {
                    setError('Выберите Scrum-мастера');
                    return;
                }

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
            loadTeamMembers(sprint.team_id || 1);
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

    const handleSaveNewSprint = () => {
        if (!newSprint.team_id) {
            setError('Выберите команду');
            return;
        }

        if (!newSprint.scrumMaster_id) {
            setError('Выберите Scrum-мастера');
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            api.sprint.createSprint(newSprint)
                .then((createdTask) => {
                    setSprints([...sprints, createdTask]);
                    setIsAddingNewSprint(false);
                    setNewSprint({
                        id: 0,
                        name: '',
                        startTime: format(new Date(new Date().getTime()), 'yyyy-MM-dd'),
                        endTime: format(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                        sp: 100,
                        state: 'ACTIVE',
                        team_id: 0,
                        team_name: '',
                        scrumMaster_id: 0,
                        scrumMaster_fullName: '',
                    });
                })
                .catch((err) => {
                    console.error('Failed to create sprint', err);
                    setError('Failed to create sprint');
                });
        }
    };

    const handleNewSprintChange = (field: keyof Sprint, value: string | number) => {
        setNewSprint({ ...newSprint, [field]: value });
        if (field === 'team_id') {
            loadTeamMembers(value as number);
        }
    };

    const loadTeamMembers = (teamId: number) => {
        if (!teamId) return; // Не загружать участников, если команда не выбрана
        
        api.team.getTeamMembersInfo(teamId)
            .then((members) => {
                const userInfos = members.map(member => member.userInfo);
                setTeamMembers(userInfos);
            })
            .catch((err) => {
                console.error('Failed to load team members', err);
                setError('Failed to load team members');
            });
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список спринтов" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.sprints} />}
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
                                <div>Статус</div>
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
                                            <div>{sprint.team_name}</div>
                                            <select
                                                value={editedSprint?.scrumMaster_id || 0}
                                                onChange={(e) => handleSprintChange('scrumMaster_id', parseInt(e.target.value))}
                                            >
                                                <option value="">Выберите Scrum-мастера</option>
                                                {teamMembers.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member. fullName}
                                                    </option>
                                                ))}
                                            </select>
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
                                            <input
                                                type="text"
                                                value={editedSprint?.state || ''}
                                                onChange={(e) => handleSprintChange('state', e.target.value)}
                                            />
                                            <div></div>
                                        </>
                                    ) : (
                                        <>
                                            <div>{sprint.name}</div>
                                            <div>{sprint.team_name}</div>
                                            <div>{sprint.scrumMaster_fullName}</div>
                                            <div>{format(new Date(sprint.startTime), 'dd.MM.yyyy')}</div>
                                            <div>{format(new Date(sprint.endTime), 'dd.MM.yyyy')}</div>
                                            <div>{sprint.sp}</div>
                                            <div>{sprint.state}</div>
                                            <div><button>Перейти</button></div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {isAddingNewSprint && (
                                <div className="sprint-tile">
                                    <div className="edit_button_container">
                                        <button
                                            className="edit_button"
                                            onClick={handleSaveNewSprint}
                                        >
                                            ✓
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={newSprint.name}
                                        onChange={(e) => handleNewSprintChange('name', e.target.value)}
                                    />
                                    <select
                                        value={newSprint.team_id}
                                        onChange={(e) => handleNewSprintChange('team_id', parseInt(e.target.value))}
                                    >
                                        <option value="">Выберите команду</option>
                                        {teams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={newSprint.scrumMaster_id}
                                        onChange={(e) => handleNewSprintChange('scrumMaster_id', parseInt(e.target.value))}
                                    >
                                        <option value="">Выберите Scrum-мастера</option>
                                        {teamMembers.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.fullName}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        value={newSprint.startTime}
                                        onChange={(e) => handleNewSprintChange('startTime', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        value={newSprint.endTime}
                                        onChange={(e) => handleNewSprintChange('endTime', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={newSprint.sp}
                                        onChange={(e) => handleNewSprintChange('sp', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={newSprint.state}
                                        onChange={(e) => handleNewSprintChange('state', e.target.value)}
                                    />
                                    <div></div>
                                </div>
                            )}
                            <button onClick={handleAddNewSprint}>Добавить спринт</button>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default SprintsPage;