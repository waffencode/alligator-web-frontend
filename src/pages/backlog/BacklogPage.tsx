import React, { useEffect, useState } from 'react';
import Sidebar from '../../widgets/Sidebar';
import './BacklogPage.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { getTasksForBacklog } from '../../shared/api';
import { Task } from '../../shared/api/IResponses';
import { format } from 'date-fns';

const BacklogPage: React.FC = () => {
    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

    return (
        <div className="profile-page">
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className="profile-content">
                <h1>Задачи в бэклоге</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="profile-info">
                    <div className="sprints-grid">
                        <div className="sprints-grid-header">
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
                                <div>{task.headline}</div>
                                <div onClick={() => handleDescriptionClick(task)} className="task-description">
                                    {task.description.substring(0, 20)}...
                                </div>
                                <div>{task.priority}</div>
                                <div>{task.deadline ? format(new Date(task.deadline), 'dd.MM.yyyy') : ''}</div>
                                <div></div>
                                <div></div>
                                <div>{task.state}</div>
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