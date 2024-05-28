import React, { useContext, useEffect, useState } from 'react';
import './SprintTasksPage.css';
import { Sprint, UserInfo_TeamMember, SprintTask } from '../../shared/api/IResponses'; // SprintTask
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from '../../widgets/Layout/Layout';
import Content from '../../widgets/Content/Content';
import BrandLogo from '../../widgets/BrandLogo/BrandLogo';
import PageName from '../../widgets/PageName/PageName';
import Sidebar from '../../widgets/SideBar/SideBar';
import Button from "../../widgets/Button/Button";
import SprintsPage from "./SprintsPage";
import {useParams} from "react-router-dom";

const SprintTasksPage: React.FC = () => {
    const {api} = useContext(ApiContext);
    const sprintId = Number(useParams<{ id: string }>().id);
    const [error, setError] = useState<string | null>(null);
    const [spCur, setSpCur] = useState<number>(0);
    const [spLimit, setSpLimit] = useState<number>(0);
    const [tasks, setTasks] = useState<SprintTask[]>([]); // SprintTask[]
    const [selectedTask, setSelectedTask] = useState<SprintTask | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<SprintTask | null>(null);
    const [isAddingNewTask, setIsAddingNewTask] = useState<boolean>(false);
    const [teamMembers, setTeamMembers] = useState<UserInfo_TeamMember[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.sprintTask.getSprintTasksWithAllInfoBySprintId(sprintId)
                .then((tasks) => {
                    setTasks(tasks);
                })
                .catch((err) => {
                    console.error('Failed to fetch tasks', err);
                    setError('Failed to load tasks');
                });
        } else {
            setError('No authentication token found');
        }
    }, [api.tasks]);

    const handleEditClick = (task: SprintTask) => {
        if (editingTaskId === task.id) {
            if (editedTask) {
                const token = localStorage.getItem('token');
                if (token) {
                    //api.tasks.updateTask(editedTask)
                    //    .then(() => {
                            setTasks(tasks.map(t => t.id === editedTask.id ? editedTask : t));
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

    const getValue = (value: string | undefined) => value !== undefined ? value : '';

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
            topRight={<PageName text="Список задач в спринте" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.sprints} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile-info">
                        <h2>SP: {spCur}/{spLimit}</h2>
                        <Button>Автоматически назначить задачи</Button>
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
                            {tasks.map((task, index) => (
                                <div key={index} className="sprint-tile">
                                    <div className="edit_button_container">
                                        <button 
                                            className="edit_button"
                                            onClick={() => handleEditClick(task)}
                                        >✕</button>
                                    </div>
                                    <div className="edit_button_container">
                                        
                                        <button
                                            className="edit_button"
                                            onClick={() => handleEditClick(task)}
                                        >
                                            {editingTaskId === task.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {editingTaskId === task.id ? (
                                        <>
                                            <div>{task.headline}</div>
                                            {task.description ? <div onClick={() => handleDescriptionClick(task)} className="task_description">
                                                {task.description.substring(0, 20)}...
                                            </div> : ''}
                                            <div>{task.priority}</div>
                                            <div>{task.deadline_time ? format(new Date(task.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{task.deadline_type ? task.deadline_type : ''}</div>
                                            <div></div>
                                            <div></div>
                                            <div>{task.sp}</div>
                                            <div></div>
                                            <select
                                                value={editedTask?.team_member_id || 0}
                                                onChange={(e) => handleTaskChange('team_member_id', parseInt(e.target.value))}
                                            >
                                                <option value="">Назначьте ответственного</option>
                                                {teamMembers.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member. fullName}
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
                                            <div>{task.headline}</div>
                                            {task.description ? <div onClick={() => handleDescriptionClick(task)} className="task_description">
                                                {task.description.substring(0, 20)}...
                                            </div> : ''}
                                            <div>{task.priority}</div>
                                            <div>{task.deadline_time ? format(new Date(task.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{task.deadline_type ? task.deadline_type : ''}</div>
                                            <div></div>
                                            <div></div>
                                            <div>{task.sp}</div>
                                            <div></div>
                                            <div>{task.state}</div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Content>
            }
        />
    );
}

export default SprintTasksPage;