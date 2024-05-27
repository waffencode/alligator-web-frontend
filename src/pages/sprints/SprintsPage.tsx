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
import {Team} from '../../shared/api/IResponses';


const SprintsPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [sprints, setSprints] = useState<Sprint[]>([]);;
    const [error, setError] = useState<string | null>(null);
    const [editingSprintId, setEditingSprintId] = useState<number | null>(null);
    const [editedSprint, setEditedSprint] = useState<Sprint | null>(null);
    const [isAddingNewSprint, setIsAddingNewSprint] = useState<boolean>(false);
/*    
    const [newSprint, setNewSprint] = useState<Sprint>({
        id: 0,
        team: team,
        description: '',
        priority: 'A', // По умолчанию приоритет A

        startTime: format(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Дедлайн через неделю
        endTime: format(new Date(new Date().getTime()), 'yyyy-MM-dd'), // Дедлайн через неделю

        sp: 0, 
        state: 'TODO', // По умолчанию задача в статусе TODO
    });
*/

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            //api.sprint.getSprintsOfCurrentUser()
            api.sprint.getSprints()
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

    const handleAddNewSprint = () => {
        setIsAddingNewSprint(true);
    };

    const handleEditClick = (sprint: Sprint) => {
        if (editingSprintId === sprint.id) {
            if (editedSprint) {
                const token = localStorage.getItem('token');
                if (token) {
                   /* api.tasks.updateTask(editedTask)
                        .then(() => {
                            setTasks(tasks.map(t => t.id === editedTask.id ? editedTask : t));
                            setEditingTaskId(null);
                            setEditedTask(null);
                        })
                        .catch((err) => {
                            console.error('Failed to update task', err);
                            setError('Failed to update task');
                        });
                }*/
                }
            } else {
                setEditingSprintId(sprint.id);
                setEditedSprint(sprint);
            }
        }

    }

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список спринтов" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.backlog} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile-page">
                        <div className="profile-content">
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

                                                <div>hello</div>
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
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default SprintsPage;