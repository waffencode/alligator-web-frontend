import React, {useContext, useEffect, useState} from 'react';
import styles from './BacklogPage.module.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { Task } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import {RoutePaths} from "../../shared/config/routes";
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";

const BacklogPage: React.FC = () => {
    const {api} = useContext(ApiContext);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<Task | null>(null);

    // TODO: move getting item to key, maybe transform to hook
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.tasks.getTasksForBacklog()
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
    }, []);

    const handleDescriptionClick = (task: Task) => {
        setSelectedTask(task);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    const handleEditClick = (task: Task) => {
        if (editingTaskId === task.id) {
            if (editedTask) {
                const token = localStorage.getItem('token');
                if (token) {
                    api.tasks.updateTask(editedTask)
                        .then(() => {
                        setTasks(tasks.map(t => t.id === editedTask.id ? editedTask : t));
                        setEditingTaskId(null);
                        setEditedTask(null);
                         })
                        .catch((err) => {
                             console.error('Failed to update task', err);
                             setError('Failed to update task');
                        });
                }
            }
        } else {
            setEditingTaskId(task.id);
            setEditedTask(task);
        }
    };

    const handleTaskChange = (field: keyof Task, value: string | number) => {
        if (editedTask) {
            if (field === 'deadline_time') {
                const editedDeadlineTime = new Date(value);
                //editedDeadlineTime.setHours(editedDeadlineTime.getHours() + 3); // Добавляем 3 часа
                setEditedTask({ ...editedTask, deadline_time: editedDeadlineTime.toISOString() });
            } else {
                setEditedTask({ ...editedTask, [field]: value });
            }
        }
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Бэклог проекта" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.backlog} />}
            bottomRight={
                <Content>
                    {/*TODO: move "error" to widgets*/}
                    {error && <div className="error-message">{error}</div>}
                    {/*TODO: where is profile-info css?*/}
                    <div className="profile-info">
                        <div className={styles.sprints_grid}>
                            <div className={styles.sprints_grid_header}>
                                <div>Название</div>
                                <div>Описание</div>
                                <div>Приоритет</div>
                                <div>Дедлайн</div>
                                <div>Зависимые задачи</div>
                                <div>Ответственный</div>
                                <div>Статус</div>
                            </div>
                            {tasks.map((task, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={() => handleEditClick(task)}
                                        >
                                            {editingTaskId === task.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {editingTaskId === task.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedTask?.headline || ''}
                                                onChange={(e) => handleTaskChange('headline', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={editedTask?.description || ''}
                                                onChange={(e) => handleTaskChange('description', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                value={editedTask?.priority || ''}
                                                onChange={(e) => handleTaskChange('priority', e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                value={editedTask?.deadline_time ? format(new Date(editedTask?.deadline_time), 'yyyy-MM-dd') : ''}
                                                onChange={(e) => handleTaskChange('deadline_time', e.target.value)}
                                            />
                                            <div></div>
                                            <div></div>
                                            <input
                                                type="text"
                                                value={editedTask?.state || ''}
                                                onChange={(e) => handleTaskChange('state', e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div>{task.headline}</div>
                                            <div onClick={() => handleDescriptionClick(task)} className={styles.task_description}>
                                                {task.description.substring(0, 20)}...
                                            </div>
                                            <div>{task.priority}</div>
                                            <div>{task.deadline_time ? format(new Date(task.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div></div>
                                            <div></div>
                                            <div>{task.state}</div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <button>Добавить задачу</button>
                        </div>
                        {/*TODO: move "modal" to widgets*/}
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
};

export default BacklogPage;