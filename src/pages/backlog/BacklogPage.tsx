import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './BacklogPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { getTasksForBacklog, updateTask } from '../../shared/api';
import { Task } from '../../shared/api/IResponses';
import { format } from 'date-fns';

const BacklogPage: React.FC = () => {
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<Task | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getTasksForBacklog(token)
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
                    updateTask(token, editedTask)
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
        <div className="profile-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="profile-content">
                <h1>Задачи в бэклоге</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="profile-info">
                    <div className="sprints-grid">
                        <div className="sprints-grid-header">
                            <div></div>
                            <div>Название</div>
                            <div>Описание</div>
                            <div>Приоритет</div>
                            <div>Дедлайн</div>
                            <div>Зависимые задачи</div>
                            <div>Ответственный</div>
                            <div>Статус</div>
                        </div>
                        {tasks.map((task, index) => (
                            <div key={index} className="sprint-tile">
                                <button 
                                    className="edit-button" 
                                    onClick={() => handleEditClick(task)}
                                >
                                    {editingTaskId === task.id ? '✓' : '✎'}
                                </button>
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
                                        <div onClick={() => handleDescriptionClick(task)} className="task-description">
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
            </div>
        </div>
    );
};

export default BacklogPage;