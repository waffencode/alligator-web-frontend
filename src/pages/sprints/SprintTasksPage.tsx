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
                                            <input
                                                type="text"
                                                value={getValue(editedTask?.headline
                                                )}
                                                onChange={(e) => handleTaskChange('headline', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={getValue(editedTask?.description)}
                                                onChange={(e) => handleTaskChange('description', e.target.value)}
                                            />
                                            <select
                                                value={getValue(editedTask?.priority)}
                                                onChange={(e) => handleTaskChange('priority', e.target.value)}
                                            >
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="E">E</option>
                                            </select>
                                            <input
                                                type="date"
                                                value={editedTask?.deadline_time ? format(new Date(editedTask?.deadline_time), 'yyyy-MM-dd') : ''}
                                                onChange={(e) => handleTaskChange('deadline_time', e.target.value)}
                                            />
                                            <select
                                                value={getValue(editedTask?.deadline_type)}
                                                onChange={(e) => handleTaskChange('deadline_type', e.target.value)}
                                            >
                                                <option value="SOFT">SOFT</option>
                                                <option value="HARD">HARD</option>
                                            </select>
                                            <div></div>
                                            <div></div>
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