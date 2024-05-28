import React, { useContext, useEffect, useState } from 'react';
import './SprintTasksPage.css';
import { SprintTask, TeamMember, Task } from '../../shared/api/IResponses'; // Imported necessary types
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from '../../widgets/Layout/Layout';
import Content from '../../widgets/Content/Content';
import BrandLogo from '../../widgets/BrandLogo/BrandLogo';
import PageName from '../../widgets/PageName/PageName';
import Sidebar from '../../widgets/SideBar/SideBar';
import Button from "../../widgets/Button/Button";
import { useParams } from "react-router-dom";

const SprintTasksPage: React.FC = () => {
    const { api } = useContext(ApiContext);
    const sprintId = Number(useParams<{ id: string }>().id);
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
    const [newTask, setNewTask] = useState<SprintTask>({
        id: 0,
        headline: '',
        description: '',
        priority: 'A', 
        deadline_time: format(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        deadline_type: 'SOFT', 
        state: 'TODO', 
        sp: 0,
        team_member_fullName: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('useEffect call with sprintId: ', sprintId);
            loadSprintTasks();

            api.sprint.getSprintBySprintId(sprintId)
                .then((sprint) => {
                    setSpLimit(sprint.sp);
                })
                .catch((err) => {
                    console.error('Failed to fetch sprint info', err);
                    setError('Ошибка при получении информации о спринте!');
                });
            api.sprintTask.getProposedTasks() // задачи, доступные для добавления в спринт
                .then((proposedTasks) => {
                    setProposedTasks(proposedTasks);
                })
                .catch((err) => {
                    console.error('Failed to fetch proposed tasks', err);
                    setError('Failed to load proposed tasks');
                });
        } else {
            setError('No authentication token found');
        }
    }, [api.tasks, api.sprintTask]);


    useEffect(() => {
        let currentSpCount = 0;

        for (const task of sprintTasksList) {
            currentSpCount += task.sp;
            console.log("currentSpCount: ", currentSpCount);
        }

        setSpCur(currentSpCount);

    }, [sprintTasksList]);

    const loadSprintTasks = ()  => {
        api.sprintTask.getSprintTasksWithAllInfoBySprintId(sprintId)
            .then((tasks) => {
                setSprintTasksList(tasks);
            })
            .catch((err) => {
                console.error('Failed to load sprint tasks', err);
                setError('Ошибка при загрузке задач!');
            });
    }

    const handleEditClick = (task: SprintTask) => {
        if (editingTaskId === task.id) {
            if (editedTask) {
                const token = localStorage.getItem('token');

                if (token) {
                    // api.tasks.updateTask(editedTask)
                    //    .then(() => {
                            setSprintTasksList(sprintTasksList.map(t => t.id === editedTask.id ? editedTask : t));
                            setEditingTaskId(null);
                            setEditedTask(null);
                    //    })
                    //    .catch((err) => {
                    //        console.error('Failed to update task', err);
                    //        setError('Failed to update task');
                    //    });
                }
            }
        } else {
            setEditingTaskId(task.id);
            setEditedTask(task);
            loadTeamMembers();
        }
    };

    const handleTaskChange = (field: keyof SprintTask, value: string | number) => {
        if (editedTask) {
            if (field === 'deadline_time') {
                const editedDeadlineTime = new Date(value);
                setEditedTask({ ...editedTask, deadline_time: editedDeadlineTime.toISOString() });
            } else {
                setEditedTask({ ...editedTask, [field]: value });
            }
        }
    };

    const handleDescriptionClick = (task: SprintTask) => {
        setSelectedTask(task);
    };

    const handleAssignationCall = ()  =>  {
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
                setError('Failed to load team members');
            });
    };

    const handleAddProposedTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProposedTaskId) {
            const selectedTask = proposedTasks.find(task => task.id === selectedProposedTaskId);
            if (selectedTask) {
                const token = localStorage.getItem('token');
                if (token) {
                   // api.sprintTask.addTaskToSprint(selectedProposedTaskId, sprintId)
                    //    .then((newTask) => {
                            setSprintTasksList([...sprintTasksList, newTask]);
                            setSelectedProposedTaskId(null);
                   //     })
                   //     .catch((err) => {
                   //         console.error('Failed to add proposed task', err);
                    //        setError('Failed to add proposed task');
                    //    });
                }
            }
        }
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Список задач в спринте" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.sprints} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile-info">
                        <h2>SP: {spCur}/{spLimit}</h2>
                        <Button onClick={handleAssignationCall}>Автоматически назначить задачи</Button>
                        <div className="sprints-grid">
                            <div className="sprints-grid-header">
                                <div>Убрать в бэклог</div>
                                <div>Редактировать</div>
                                <div>Название</div>
                                <div>Описание</div>
                                <div>Приоритет</div>
                                <div>Дедлайн</div>
                                <div>Тип дедлайна</div>
                                <div>Роли</div>
                                <div>Зависимые задачи</div>
                                <div>SP</div>
                                <div>Ответственный</div>
                                <div>Статус</div>
                           </div>
                            {sprintTasksList.map((sprintTask, index) => (
                                <div key={index} className="sprint-tile">
                                    <div className="edit_button_container">
                                        <button 
                                            className="edit_button"
                                            onClick={() => handleEditClick(sprintTask)}
                                        >✕</button>
                                    </div>
                                    <div className="edit_button_container">
                                        <button
                                            className="edit_button"
                                            onClick={() => handleEditClick(sprintTask)}
                                        >
                                            {editingTaskId === sprintTask.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {editingTaskId === sprintTask.id ? (
                                        <>
                                            <div>{sprintTask.headline}</div>
                                            {sprintTask.description ? <div onClick={() => handleDescriptionClick(sprintTask)} className="task_description">
                                                {sprintTask.description.substring(0, 20)}...
                                            </div> : ''}
                                            <div>{sprintTask.priority}</div>
                                            <div>{sprintTask.deadline_time ? format(new Date(sprintTask.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{sprintTask.deadline_type ? sprintTask.deadline_type : ''}</div>
                                            <div></div>
                                            <div></div>
                                            <div>{sprintTask.sp}</div>
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
                                            {sprintTask.description ? <div onClick={() => handleDescriptionClick(sprintTask)} className="task_description">
                                                {sprintTask.description.substring(0, 20)}...
                                            </div> : ''}
                                            <div>{sprintTask.priority}</div>
                                            <div>{sprintTask.deadline_time ? format(new Date(sprintTask.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{sprintTask.deadline_type ? sprintTask.deadline_type : ''}</div>
                                            <div></div>
                                            <div></div>
                                            <div>{sprintTask.sp}</div>
                                            <div>{sprintTask.team_member_fullName ? sprintTask.team_member_fullName : 'Не назначен'}</div>
                                            <div>{sprintTask.state}</div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            <form onSubmit={handleAddProposedTask}>
                                <div className="form-group">
                                    <label htmlFor="proposedTask">Добавить задачу</label>
                                    <select
                                        id="proposedTask"
                                        value={selectedProposedTaskId || ''}
                                        onChange={(e) => setSelectedProposedTaskId(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">Выберите задачу</option>
                                        {proposedTasks.map(task => (
                                            <option key={task.id} value={task.id}>
                                                {task.headline}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="button">Добавить</Button>
                            </form>
                        </div>
                    </div>
                </Content>
            }
        />
    );
}

export default SprintTasksPage;