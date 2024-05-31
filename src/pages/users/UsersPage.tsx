import React, { useContext, useEffect, useState } from 'react';
import styles from './UsersPage.module.css';
import { UserInfoWithRolesInterfaces, Role } from '../../shared/api/IResponses';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import { rolesTranslator, translateRole } from '../../entities/RolesTranslator';

const UsersPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [users, setUsers] = useState<UserInfoWithRolesInterfaces[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<UserInfoWithRolesInterfaces | null>(null);
    const [editedRoles, setEditedRoles] = useState<Role[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

    // Получение списка пользователей
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.user.getAllUsersInfoWithRoles()
                .then((users) => {
                    setUsers(users);
                })
                .catch((err) => {
                    console.error('Failed to fetch users', err);
                    setError('Ошибка при загрузке пользователей');
                });
        } else {
            console.error('No authentication token found');
            setError('Ошибка при проверке авторизации пользователя');
        }
    }, [api.user, editedRoles]);

    // Получение списка ролей
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.user.getRoles()
                .then((roles) => {
                    const rolesWithSelected = roles.map(role => ({ ...role, selected: false }));
                    setRoles(rolesWithSelected);
                })
                .catch((err) => {
                    console.error('Failed to fetch roles', err);
                    setError('Ошибка при загрузке ролей');
                });
        } else {
            console.error('No authentication token found');
            setError('Ошибка при проверке авторизации пользователя');
        }
    }, [api.user]);

    const handleEditClick = (user: UserInfoWithRolesInterfaces) => {
        if (editingUserId === user.id) {
            if (editedUser) {
                const token = localStorage.getItem('token');
                if (token) {
                    const oldRoles = user.roles;
                    const newRoles = getUpdatedUserRoles();
                    console.log(oldRoles);
                    console.log(newRoles);
                    api.user.updateUser(user, oldRoles, newRoles); // удаляем старые из таблицы, добавляем новые
                    setUsers(users.map(t => t.id === editedUser.id ? editedUser : t));
                    setEditingUserId(null);
                    setEditedUser(null);
                    setEditedRoles([]);
                }
            }
        } else {
            setEditingUserId(user.id);
            setEditedUser(user);
            const markedRoles = roles.map(role => {
                const foundRole = user.roles.find(userRole => userRole.role_id === role.id);
                return foundRole ? { ...role, selected: true } : { ...role, selected: false };
            });
            setEditedRoles(markedRoles); // если у пользователя есть роль, то она помечена
        }
    };

    const getUpdatedUserRoles = () => {
        return editedRoles.filter(role => role.selected);
    };

    const handleRoleEdit = (roleId: number) => {
        const updatedRoles = editedRoles.map(role => // editedRoles -- список всех ролей (тек. пользователя) с выбором 
            role.id === roleId ? { ...role, selected: !role.selected } : role
        );
        setEditedRoles(updatedRoles);
    };

    const toggleRoleDropdown = () => {
        setShowRoleDropdown(!showRoleDropdown);
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
                                            onClick={() => handleEditClick(user)}
                                        >
                                            {editingUserId === user.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    <div>{user.fullName}</div>
                                    <div>{user.email}</div>
                                    <div>{user.phone_number}</div>
                                    <div>
                                        {editingUserId === user.id ? (
                                            // Render role dropdown when editing
                                            <div className={styles.roleDropdown}>
                                                <div className={styles.roleField} onClick={toggleRoleDropdown}>
                                                    {showRoleDropdown ? '▲' : '▼'}
                                                    Роли
                                                </div>
                                                {showRoleDropdown && (
                                                    <div className={styles.roleOptions}>
                                                        {roles.map(role => (
                                                            <label key={role.id}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editedRoles.some(r => r.id === role.id && r.selected)}
                                                                    onChange={() => handleRoleEdit(role.id)}
                                                                />
                                                                {translateRole(role.name)}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            rolesTranslator(user.roles.filter(role => role.name !== undefined).map(role => role.name!))
                                        )}
                                    </div>
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