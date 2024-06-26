import React, { useContext, useEffect, useState } from 'react';
import styles from './BacklogPage.module.css';
import { Task } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import Modal from "../../widgets/Modal/Modal";
import CreateNewTaskModalContent from "./CreateNewTaskModalContent";
import Button from "../../widgets/Button/Button";
import {translateStatus} from "../../entities/StatusTranslator";

const BacklogPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [isAddingNewTask, setIsAddingNewTask] = useState<boolean>(false);
    const [newTask, setNewTask] = useState<Task>({
        id: 0,
        headline: '',
        description: '',
        priority: 'A', 
        deadline_time: format(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        deadline_type: 'SOFT', 
        state: 'TODO', 
    });
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [taskCreateModalOpen, setTaskCreateModalOpen] = useState(false);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.tasks.getTasksForBacklog()
                .then((tasks) => {
                    setTasks(tasks);
                })
                .catch((err) => {
                    console.error('Failed to fetch tasks', err);
                    setError('Ошибка при загрузке задач');
                });
        } else {
            console.error('No authentication token found');
            setError('Ошибка проверки авторизации пользователя');
        }
    }, [api.tasks]);
    
    const handleDescriptionClick = (taskId: number) => {
        setExpandedTaskId(taskId === expandedTaskId ? null : taskId);
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
                            setError('Ошибка при изменении задачи');
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
                setEditedTask({ ...editedTask, deadline_time: editedDeadlineTime.toISOString() });
            } else {
                setEditedTask({ ...editedTask, [field]: value });
            }
        }
    };
    const handleNewTaskChange = (field: keyof Task, value: string | number) => {
        if (field === 'description') {
            const newValue = value.toString().slice(0, 250); // Ограничиваем длину описания до 250 символов
            setNewTask((prevTask) => ({ ...prevTask, [field]: newValue }));
        } else if (field === 'deadline_time') {
            const newDeadlineTime = new Date(value as string);
            setNewTask((prevTask) => ({ ...prevTask, deadline_time: newDeadlineTime.toISOString() }));
        } else {
            setNewTask((prevTask) => ({ ...prevTask, [field]: value }));
        }
    };

    const handleAddNewTask = () => {
        setIsAddingNewTask(true);
    };

    const handleSaveNewTask = () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.tasks.createTask(newTask)
                .then((createdTask) => {
                    createdTask.deadline_time = newTask.deadline_time;
                    createdTask.deadline_type = newTask.deadline_type;
                    setTasks([...tasks, createdTask]);
                    setIsAddingNewTask(false);
                    setNewTask({
                        id: 0,
                        headline: '',
                        description: '',
                        priority: 'A', // Сбрасываем параметры newTask к исходным значениям
                        deadline_time: format(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Сбрасываем параметры newTask к исходным значениям
                        deadline_type: 'SOFT', // Сбрасываем параметры newTask к исходным значениям
                        state: 'TODO', // Сбрасываем параметры newTask к исходным значениям
                    });
                    
                })
                .catch((err) => {
                    console.error('Failed to create task', err);
                    setError('Ошибка при создании задачи');
                });
        }
    };

    const handleTaskSelect = (taskId: number) => {
        setSelectedTaskIds((prevSelectedTaskIds) =>
            prevSelectedTaskIds.includes(taskId)
                ? prevSelectedTaskIds.filter((id) => id !== taskId)
                : [...prevSelectedTaskIds, taskId]
        );
    };

    const handleDeleteSelectedTasks = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту задачу?');
            if (confirmed) {
            const promises = selectedTaskIds.map((taskId) => api.tasks.deleteTask(taskId));
            Promise.all(promises)
                .then(() => {
                    setTasks(tasks.filter((task) => !selectedTaskIds.includes(task.id)));
                    setSelectedTaskIds([]);
                })
                .catch((err) => {
                    console.error('Failed to delete tasks', err);
                    setError('Ошибка при удалении задачи');
                });
            }
        }
    };

    const getValue = (value: string | undefined) => value !== undefined ? value : '';

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Бэклог проекта" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.backlog} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    {taskCreateModalOpen &&
                        <Modal
                            closeCallback={() => {setTaskCreateModalOpen(false)}}
                            name={"Создание задачи"}
                        >
                            <CreateNewTaskModalContent />
                        </Modal>
                    }
                    <div className="profile-info">
                        <div className={styles.sprints_grid}>
                            <div className={styles.sprints_grid_header}>
                                <div>Выбрать</div>
                                <div>Редактировать</div>
                                <div>Название</div>
                                <div>Описание</div>
                                <div>Приоритет</div>
                                <div>Дедлайн</div>
                                <div>Тип дедлайна</div>
                                <div>Статус</div>
                            </div>
                            {tasks.map((task, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={selectedTaskIds.includes(task.id)}
                                            onChange={() => handleTaskSelect(task.id)}
                                        />
                                    </div>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={() => handleEditClick(task)}
                                        >
                                            {editingTaskId === task.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {expandedTaskId === task.id && (
                                        <div className={styles.task_description_expanded}>
                                            <button className={styles.close_button} onClick={() => handleDescriptionClick(task.id)}>
                                                &times;
                                            </button>
                                            <p style={{ whiteSpace: "pre-wrap" }}>{task.description}</p>
                                        </div>
                                    )}

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
                                            <div onClick={() => handleDescriptionClick(task.id)} className={styles.task_description}>
                                                {task.description.substring(0, 20)}...
                                            </div>
                                            <div>{task.priority}</div>
                                            <div>{task.deadline_time ? format(new Date(task.deadline_time), 'dd.MM.yyyy') : ''}</div>
                                            <div>{task.deadline_type ? task.deadline_type : ''}</div>
                                            <div>{translateStatus(task.state)}</div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {isAddingNewTask && (
                                <div className={styles.sprint_tile}>
                                    <div></div>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={handleSaveNewTask}
                                        >
                                            ✓
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={getValue(newTask.headline)}
                                        onChange={(e) => handleNewTaskChange('headline', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={getValue(newTask.description)}
                                        onChange={(e) => handleNewTaskChange('description', e.target.value)}
                                        
                                    />



                                    <select
                                        value={(getValue(newTask.priority) ? getValue(newTask.priority) : "A")}
                                        onChange={(e) => handleNewTaskChange('priority', e.target.value)}
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                    </select>
                                    <input
                                        type="date"
                                        value={newTask.deadline_time ? format(new Date(newTask.deadline_time), 'yyyy-MM-dd') : ''}
                                        onChange={(e) => handleNewTaskChange('deadline_time', e.target.value)}
                                    />
                                    <select
                                        value={getValue(newTask.deadline_type) ? getValue(newTask.deadline_type) : "SOFT"}
                                        onChange={(e) => handleNewTaskChange('deadline_type', e.target.value)}
                                    >
                                        <option value="SOFT">SOFT</option>
                                        <option value="HARD">HARD</option>
                                    </select>
                                    <select
                                        value={getValue(newTask.state) ? getValue(newTask.state) : "TODO"}
                                        onChange={(e) => handleNewTaskChange('state', e.target.value)}
                                    >
                                        <option value="NEED_REWORK">Требуется доработка</option>
                                        <option value="TODO">Сделать</option>
                                        <option value="PICKED">Выбрано</option>
                                        <option value="IN_PROGRESS">В процессе</option>
                                        <option value="TESTING">На тестировании</option>
                                        <option value="DONE">Выполнено</option>
                                        <option value="ABORTED">Прервано</option>
                                    </select>
                                </div>
                            )}
                            <Button onClick={handleAddNewTask}>
                                Добавить задачу
                            </Button>
                            <Button onClick={handleDeleteSelectedTasks}>
                                Удалить выбранные задачи
                            </Button>
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
};

export default BacklogPage;


