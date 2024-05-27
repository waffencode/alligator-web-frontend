import React, { useContext, useEffect, useState } from 'react';
import styles from './UsersPage.module.css';
import { Task } from '../../shared/api/IResponses';
import { UserProfileWithRoles, UserInfoWithRolesInterfaces } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import { rolesTranslator } from '../../entities/RolesTranslator';


const UsersPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [users, setUsers] = useState<UserInfoWithRolesInterfaces[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
/*
    const users: UserProfileWithRoles[] =[
        {
            id: 1,
            fullName: "John Doe",
            email: "john.doe@example.com",
            phone_number: "123-456-7890",
            roles: ["USER"]
        },
        {
            id: 2,
            fullName: "Jane Smith",
            email: "jane.smith@example.com",
            phone_number: "098-765-4321",
            roles: ["USER"]
        },
        {
            id: 3,
            fullName: "Emily Johnson",
            email: "emily.johnson@example.com",
            phone_number: "456-789-0123",
            roles: ["USER"]
        }
    ];

*/
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.user.getAllUsersInfoWithRoles()
                .then((users) => {
                    setUsers(users);
                })
                .catch((err) => {
                    console.error('Failed to fetch tasks', err);
                    setError('Failed to load tasks');
                });
        } else {
            setError('No authentication token found');
        }
    }, [api.tasks]);

 const handleEditClick = (user: UserProfileWithRoles) => {
 /*   if (editingTaskId === task.id) {
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
    }*/
};

const handleUserSelect = (userId: number) => {
    setSelectedUserIds((prevSelectedUserIds) =>
        prevSelectedUserIds.includes(userId)
            ? prevSelectedUserIds.filter((id) => id !== userId)
            : [...prevSelectedUserIds, userId]
    );
};

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Пользователи" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.users} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile-info">
                        <div className={styles.sprints_grid}>
                            <div className={styles.sprints_grid_header}>
                                <div>Редактировать</div>
                                <div>ФИО</div>
                                <div>Email</div>
                                <div>Номер телефона</div>
                                <div>Роль</div>
                            </div>
                            {users.map((user, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            //onClick={}
                                        >
                                            {editingUserId === user.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    <div>{user.fullName}</div>
                                    <div>{user.email}</div>
                                    <div>{user.phone_number}</div>
                                    <div>{rolesTranslator(user.roles.filter(role => role.name !== undefined).map(role => role.name!))}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default UsersPage;