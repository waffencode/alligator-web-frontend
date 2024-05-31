import React, { useContext, useEffect, useState } from 'react';
import styles from './SprintTasksPage.module.css';
import { SprintTask, TeamMember, Task, TeamRole } from '../../shared/api/IResponses'; // Imported necessary types
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from '../../widgets/Layout/Layout';
import Content from '../../widgets/Content/Content';
import BrandLogo from '../../widgets/BrandLogo/BrandLogo';
import PageName from '../../widgets/PageName/PageName';
import Sidebar from '../../widgets/SideBar/SideBar';
import Button from "../../widgets/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { translateStatus } from "../../entities/StatusTranslator";

const SprintTasksPage: React.FC = () => {
    const navigate = useNavigate();
    const { api } = useContext(ApiContext);
    const sprintId = Number(useParams<{ id: string }>().id);
    const [sprintName, setSprintName] = useState<string | null>(null);
    const [spCur, setSpCur] = useState<number>(0);
    const [spLimit, setSpLimit] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [sprintTasksList, setSprintTasksList] = useState<SprintTask[]>([]); // SprintTask[]
    const [selectedTask, setSelectedTask] = useState<SprintTask | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<SprintTask | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [proposedTasks, setProposedTasks] = useState<Task[]>([]); // New state for proposed tasks
    const [selectedProposedTaskId, setSelectedProposedTaskId] = useState<number | null>(null); // State for selected proposed task
    const [expandedSprintTaskId, setExpandedSprintTaskId] = useState<number | null>(null);
    const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
    const [editedTeamRoles, setEditedTeamRoles] = useState<TeamRole[]>([]); // список ролей задачи, которую редактируем в данный момент
    const [teamRoles, setTeamRoles] = useState<TeamRole[]>([]); // все доступные роли, можем задавать свойство selected
    // для отображения ролей:
    const [expandedRolesSprintTaskId, setExpandedRolesSprintTaskId] = useState<number | null>(null);
    const [expendedTeamRoles, setExpendedTeamRoles] = useState<TeamRole[]>([]); // роли задачи, открытые в окне

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            loadSprintTasks();

            api.sprint.getSprintBySprintId(sprintId)
                .then((sprint) => {
                    setSpLimit(sprint.sp);
                    setSprintName(sprint.name);
                })
                .catch((err) => {
                    console.error('Failed to fetch sprint info', err);
                    setError('Ошибка при получении информации о спринте!');
                });
        } else {
            console.error('No authentication token found');
            setError('Ошибка при проверке авторизации пользователя');
        }
    }, [api.tasks, api.sprintTask]);

    useEffect(() => {
        // Count the total complexity of tasks in the sprintTasksList
        setSpCur(sprintTasksList.reduce((totalComplexity, sprintTask) => totalComplexity + sprintTask.sp, 0));
    }, [sprintTasksList]);

    const loadSprintTasks = () => {
        api.sprintTask.getSprintTasksWithAllInfoBySprintId(sprintId)
            .then((tasks) => {
                setSprintTasksList(tasks);
            })
            .catch((err) => {
                console.error('Failed to load sprint tasks', err);
                setError('Ошибка при загрузке задач!');
            });
    }

    const closeModal = () => {
        setSelectedTask(null);
    };

    const handleEditClick = (task: SprintTask) => {
        if (editingTaskId === task.id) {
            if (editedTask) {
                const token = localStorage.getItem('token');
                if (token) {
                    api.sprintTask.updateSprintTask(editedTask)
                        .then(() => {
                            setSprintTasksList(sprintTasksList.map(t => t.id === editedTask.id ? editedTask : t));
                            setEditingTaskId(null);
                            setEditedTask(null);
                            loadSprintTasks();

                            // Сбор выбранных ролей
                            const selectedRoles = teamRoles.filter(role => role.selected);
                            // Обновление ролей на сервере
                            api.teamRoles.updateSprintTaskRoles(editedTask.id, editedTeamRoles, selectedRoles);
                        })
                        .catch((err) => {
                            console.error('Failed to update task', err);
                            setError('Ошибка при изменении задачи');
                        });
                }
            }
        } else {
            setEditingTaskId(task.id);
            setEditedTask(task);
            loadTeamMembers();
        }
    };

    useEffect(() => {
        if (editedTask) {
            loadSprintTaskTeamRoles();
            loadAllTeamRoles();
        }
    }, [editedTask]);

    useEffect(() => {
        if (editedTask) {
            loadAllTeamRoles();
        }
    }, [editedTeamRoles]);

    useEffect(() => {
        if (expandedRolesSprintTaskId) {
            loadSprintTaskTeamRolesForExpanded();
        }
    }, [expandedRolesSprintTaskId]);

    const handleDeleteClick = (taskId: number) => {
        const token = localStorage.getItem('token');
        if (token) {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту задачу?');
            if (confirmed) {
                api.sprintTask.deleteSprintTaskById(taskId)
                    .then(() => {
                        setSprintTasksList(sprintTasksList.filter(task => task.id !== taskId));
                        if (editingTaskId === sprintId) {
                            setEditingTaskId(null);
                            setEditedTask(null);
                        }
                    })
                    .catch((err) => {
                        console.error('Failed to delete sprint task', err);
                        setError('Ошибка при удалении задачи из спринта');
                    });
            }
        }
    };

    const handleTaskChange = (field: keyof SprintTask, value: string | number) => {
        if (editedTask) {
            if (field === 'sp') {
                setEditedTask({ ...editedTask, sp: parseInt(value as string, 10) });
            }
            if (field === 'deadline_time') {
                const editedDeadlineTime = new Date(value);
                setEditedTask({ ...editedTask, deadline_time: editedDeadlineTime.toISOString() });
            } else {
                setEditedTask({ ...editedTask, [field]: value });
            }
        }
    };

    const handleDescriptionClick = (sprintTaskId: number) => {
        setExpandedSprintTaskId(sprintTaskId === expandedSprintTaskId ? null : sprintTaskId);
    };

    const handleRolesClick = (sprintTaskId: number) => {
        setExpandedRolesSprintTaskId(sprintTaskId === expandedRolesSprintTaskId ? null : sprintTaskId);
    };

    const handleAssignationCall = () => {
        api.sprintTask.assignTasks(sprintId)
            .then((assignedTasks) => {
                console.log('Task assignation completed with ' + assignedTasks.length + ' entries.');
            })
            .catch((err) => {
                console.error('Failed to assign tasks', err);
                setError('Ошибка при назначении задач!');
            });

        loadSprintTasks();
    }

    const getValue = (value: string | undefined) => value !== undefined ? value : '';

    const loadTeamMembers = () => {
        api.sprint.getTeamMembersBySprintId(sprintId)
            .then((members) => {
                setTeamMembers(members);
            })
            .catch((err) => {
                console.error('Failed to load team members', err);
                setError('Ошибка при загрузке списка участников команды!');
            });
    };

    const loadProposedTasks = () => {
        api.sprintTask.getProposedTasks()
            .then((proposedTasks) => {
                setProposedTasks(proposedTasks);
            })
            .catch((err) => {
                console.error('Failed to fetch proposed tasks', err);
                setError('Ошибка при загрузке бэклога!');
            });
    }

    const handleAddProposedTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProposedTaskId) {
            const selectedTask = proposedTasks.find(task => task.id === selectedProposedTaskId);
            if (selectedTask) {
                const token = localStorage.getItem('token');
                if (token) {
                    api.sprintTask.addSprintTask({ sp: 0, sprint_id: sprintId, task_id: selectedProposedTaskId })
                        .then((newTask) => {
                            setSprintTasksList([...sprintTasksList, newTask]);
                            setProposedTasks(proposedTasks.filter(task => task.id !== selectedProposedTaskId));
                            setSelectedProposedTaskId(null);
                            loadSprintTasks();
                            console.log(`Task added to sprint: '${newTask._links?.self.href}'`);
                        })
                        .catch((err) => {
                            console.error('Failed to add proposed task', err);
                            if (err.message && err.message.includes('Only scrum-master')) {
                                setError('Только Scrum-мастер может добавлять задачи на спринт');
                            } else {
                                setError('Ошибка при добавлении задачи');
                            }
                        });
                }
            }
        }
    };

    const loadSprintTaskTeamRoles = () => {
        api.sprintTask.getSprintTaskTeamRoles(editedTask?.id || 0)
            .then((teamRoles) => {
                setEditedTeamRoles(teamRoles);
            })
            .catch((err) => {
                console.error('Failed to fetch team roles', err);
                setError('Ошибка при получении информации о командных ролях');
            });
    };

    const loadSprintTaskTeamRolesForExpanded = () => {
        api.sprintTask.getSprintTaskTeamRoles(expandedRolesSprintTaskId || 0)
            .then((teamRoles) => {
                setExpendedTeamRoles(teamRoles);
            })
            .catch((err) => {
                console.error('Failed to fetch team roles', err);
                setError('Ошибка при получении информации о командных ролях');
            });
    };

    // загрузить все командные роли, отмечаем выбранными только те, что есть у задачи
    const loadAllTeamRoles = () => {
        api.teamRoles.getTeamRoles()
            .then((teamRoles) => {
                const rolesWithSelected = teamRoles.map(role => ({
                    ...role,
                    selected: editedTeamRoles.some(editedRole => editedRole.id === role.id)
                }));
                
                // Установка преобразованных командных ролей в состояние
                setTeamRoles(rolesWithSelected);
            })
            .catch((err) => {
                console.error('Failed to fetch team roles', err);
                setError('Ошибка при получении информации о командных ролях');
            });
    };

    const handleRoleEdit = (roleId: number) => {    
        // Обновляем состояние teamRoles
        const updatedRoles = teamRoles.map(role => 
            role.id === roleId ? { ...role, selected: !role.selected } : role
        );
        setTeamRoles(updatedRoles);
    };

    const getTeamRolesNames = (): string => {
        return expendedTeamRoles.map(role => role.name).join(', ');
    };

    const toggleRoleDropdown = () => {
        setShowRoleDropdown(!showRoleDropdown);
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список задач в спринте" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.sprints} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className={styles.profileInfo}>
                        <h2>Спринт '{sprintName}'</h2>
                        <h2>SP: {spCur}/{spLimit}</h2>

                        <Button onClick={handleAssignationCall}>Автоматически назначить задачи</Button>

                        <div className={styles.sprints_grid}>
                            <div className={styles.sprints_grid_header}>
                                <div>Убрать в бэклог</div>
                                <div>Редактировать</div>
                                <div>Название</div>
                                <div>Описание</div>
                                <div>Приоритет</div>
                                <div>Дедлайн</div>
                                <div>Тип дедлайна</div>
                                <div>Роли</div>
                                {/*<div>Зависимые задачи</div>*/}
                                <div>SP</div>
                                <div>Ответственный</div>
                                <div>Статус</div>
                            </div>

                            {sprintTasksList.map((sprintTask, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={() => handleDeleteClick(sprintTask.id)} // handleDeleteClick
                                        >✕
                                        </button>
                                    </div>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={() => handleEditClick(sprintTask)}
                                        >
                                            {editingTaskId === sprintTask.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {/* Здесь заменяем комментированный блок "Остальной код задачи" на код отображения описания */}
                                    {expandedSprintTaskId === sprintTask.id && (
                                        <div className={styles.task_description_expanded}>
                                            <button className={styles.close_button} onClick={() => handleDescriptionClick(sprintTask.id)}>
                                                &times;
                                            </button>
                                            <p style={{ whiteSpace: "pre-wrap" }}>{sprintTask.description}</p>
                                        </div>
                                    )}
                                    {expandedRolesSprintTaskId === sprintTask.id && (
                                        <div className={styles.task_description_expanded}>
                                            <button className={styles.close_button} onClick={() => handleRolesClick(sprintTask.id)}>
                                                &times;
                                            </button>
                                            <p style={{ whiteSpace: "pre-wrap" }}>{getTeamRolesNames()}</p>
                                        </div>
                                    )}
                                    {editingTaskId === sprintTask.id ? (
                                        <>
                                            <div>{sprintTask.headline}</div>
                                            {sprintTask.description ? (
                                                <div onClick={() => handleDescriptionClick(sprintTask.id)} className={styles.task_description}>
                                                    {sprintTask.description.substring(0, 20)}...
                                                </div>) : <div></div>}
                                            <div>{sprintTask.priority}</div>
                                            <div>{sprintTask.deadline_time ? format(new Date(sprintTask.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{sprintTask.deadline_type ? sprintTask.deadline_type : ''}</div>
                                            <div className={styles.roleDropdown}>
                                                <div className={styles.roleField} onClick={toggleRoleDropdown}>
                                                    {showRoleDropdown ? '▲' : '▼'}
                                                    Роли
                                                </div>
                                                {showRoleDropdown && (
                                                    <div className={styles.roleOptions}>
                                                        {teamRoles.map(role => (
                                                            <label key={role.id}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={role.selected}
                                                                    onChange={() => handleRoleEdit(role.id)}
                                                                />
                                                                {role.name}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {/*<div></div>*/}
                                            <input
                                                type="number"
                                                value={editedTask?.sp || 0}
                                                onChange={(e) => handleTaskChange('sp', parseInt(e.target.value))}
                                                className={styles.smallInput}
                                            />
                                            <select
                                                value={editedTask?.team_member_id || 0}
                                                onChange={(e) => handleTaskChange('team_member_id', parseInt(e.target.value))}
                                            >
                                                <option value="">Назначьте ответственного</option>
                                                {teamMembers.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={getValue(editedTask?.state)}
                                                onChange={(e) => handleTaskChange('state', e.target.value)}
                                            >
                                                <option value="NEED_REWORK">Требуется доработка</option>
                                                <option value="TODO">Сделать</option>
                                                <option value="PICKED">Выбрано</option>
                                                <option value="IN_PROGRESS">В процессе</option>
                                                <option value="TESTING">На тестировании</option>
                                                <option value="DONE">Выполнено</option>
                                                <option value="ABORTED">Прервано</option>
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <div>{sprintTask.headline}</div>
                                            {sprintTask.description ?
                                                <div onClick={() => handleDescriptionClick(sprintTask.id)} className={styles.task_description}>
                                                    {sprintTask.description.substring(0, 20)}...
                                                </div> : <div></div>}
                                            <div>{sprintTask.priority}</div>
                                            <div>{sprintTask.deadline_time ? format(new Date(sprintTask.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{sprintTask.deadline_type ? sprintTask.deadline_type : ''}</div>
                                            {/*<div></div>*/}
                                            {sprintTask.description ?
                                                <div onClick={() => handleRolesClick(sprintTask.id)} className={styles.task_description}>
                                                    Роли
                                                </div> : <div></div>}
                                            <div>{sprintTask.sp}</div>
                                            <div>{sprintTask.team_member_fullName ? sprintTask.team_member_fullName : 'Не назначен'}</div>
                                            <div>{translateStatus(sprintTask.state)}</div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <form onSubmit={handleAddProposedTask}>
                                <div className={styles.form_group}>
                                    <label htmlFor="proposedTask">
                                        <h3>Добавить задачу</h3>
                                    </label>
                                    <select
                                        id="proposedTask"
                                        value={selectedProposedTaskId || ''}
                                        onClick={loadProposedTasks}
                                        onChange={(e) => setSelectedProposedTaskId(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">Выберите задачу...</option>
                                        {proposedTasks.map(task => (
                                            <option key={task.id} value={task.id}>
                                                {task.headline}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="button margin-right">Добавить</Button>
                                <Button className="button margin-right" onClick={() => navigate(RoutePaths.sprints)}>Назад</Button>
                            </form>
                        </div>
                        {selectedTask && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close" onClick={closeModal}>&times;</span>
                                    <h2>{selectedTask.headline}</h2>
                                    <p>{selectedTask.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Content>
            }
        />
    );
}

export default SprintTasksPage;