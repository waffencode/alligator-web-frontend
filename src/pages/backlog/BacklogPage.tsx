import React, {useContext, useEffect, useState} from 'react';
import Sidebar from '../../widgets/Sidebar';
import styles from './BacklogPage.module.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { Task } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";

const BacklogPage: React.FC = () => {
    const {api} = useContext(ApiContext);

    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

    return (
        <div className={styles.profile_page}>
            <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
            <div className={styles.profile_content}>
                <h1>Задачи в бэклоге</h1>
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
                                <div>{task.headline}</div>
                                <div onClick={() => handleDescriptionClick(task)} className={styles.task_description}>
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
            </div>
        </div>
    );
};

export default BacklogPage;