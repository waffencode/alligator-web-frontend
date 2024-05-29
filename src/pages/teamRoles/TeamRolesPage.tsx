import React, { useContext, useEffect, useState } from 'react';
import styles from './TeamRolesPage.module.css';
import { UserInfoWithRolesInterfaces, Role, TeamRole } from '../../shared/api/IResponses';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import {rolesTranslator, translateRole} from '../../entities/RolesTranslator';
import Button from '../../widgets/Button/Button';

const TeamRolesPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [teamRoles, setTeamRoles] = useState<TeamRole[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingTeamRoleId, setEditingTeamRoleId] = useState<number | null>(null);
    const [editedTeamRole, setEditedTeamRole] = useState<TeamRole | null>(null);
    const [isAddingNewTeamRole, setIsAddingNewTeamRole] = useState<boolean>(false);
    const [newTeamRole, setNewTeamRole] = useState<TeamRole>({
        id: 0,
        name: ''
    });

    // Получение списка пользователей
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.teamRoles.getTeamRoles()
                .then((teamRoles) => {
                    setTeamRoles(teamRoles);
                })
                .catch((err) => {
                    console.error('Failed to fetch team roles', err);
                    setError('Ошибка при загрузке командных ролей');
                });
        } else {
            setError('No authentication token found');
        }
    }, [api.teamRoles]);

    const handleEditClick = (teamRole: TeamRole) => {
        if (editingTeamRoleId === teamRole.id) {
            if (editedTeamRole) {
                const token = localStorage.getItem('token');
                if (token) {
                    api.teamRoles.updateTeamRole(editedTeamRole);
                    setTeamRoles(teamRoles.map(t => t.id === editedTeamRole.id ? editedTeamRole : t));
                    setEditingTeamRoleId(null);
                    setEditedTeamRole(null);
                }
            }
        } else {
            setEditingTeamRoleId(teamRole.id);
            setEditedTeamRole(teamRole);
        }
    };

    const handleDeleteClick = (teamRole: TeamRole) => {
        const token = localStorage.getItem('token');
        if (token) {
            const confirmed = window.confirm('Вы уверены, что хотите удалить эту задачу?');
            if (confirmed) {
                api.teamRoles.deleteTeamRole(teamRole)
                    .then(() => {
                        setTeamRoles(teamRoles.filter(tRole => tRole.id !== teamRole.id));
                        if (editingTeamRoleId === teamRole.id) {
                            setEditingTeamRoleId(null);
                            setEditedTeamRole(null);
                        }
                    })
                    .catch((err) => {
                        console.error('Failed to delete sprint task', err);
                        setError('Ошибка при удалении задачи из спринта');
                    });
            }
        }
    };

    const handleTeamRoleEdit = (roleId: number) => {
        /*const updatedRoles = editedTeamRoles.map(role => // editedRoles -- список всех ролей (тек. пользователя) с выбором 
            role.id === roleId ? { ...role, selected: !role.selected } : role
        );
        setEditedRoles(updatedRoles);*/
    };

    const handleTeamRoleChange = (field: keyof TeamRole, value: string | number) => {
        if (editedTeamRole) {
            setEditedTeamRole({ ...editedTeamRole, [field]: value }); 
        }
    };

    const handleAddNewTeamRole = () => {
        setIsAddingNewTeamRole(true);
    };

    const handleSaveNewTeamRole = () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.teamRoles.createTeamRole(newTeamRole)
                .then((createdTeamRole) => {
                    setTeamRoles([...teamRoles, createdTeamRole]);
                    setIsAddingNewTeamRole(false);
                    setNewTeamRole({
                        id: 0,
                        name: ''
                    });
                })
                .catch((err) => {
                    console.error('Failed to create team role', err);
                    setError("Ошибка при создании командной роли");
                });
        }
    };

    const handleNewTeamRoleChange = (field: keyof TeamRole, value: string | number) => {
        setNewTeamRole({ ...newTeamRole, [field]: value });
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Командные роли" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.teamRoles} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <div className="profile-info">
                        <div className={styles.sprints_grid}>
                            <div className={styles.sprints_grid_header}>
                                <div>Удалить</div>
                                <div>Редактировать</div>
                                <div>Название роли</div>
                            </div>
                            {teamRoles.map((teamRole, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={() => handleDeleteClick(teamRole)} 
                                        >✕
                                        </button>
                                    </div>
                                    <div className={styles.edit_button_container}>
                                        <button
                                            className={styles.edit_button}
                                            onClick={() => handleEditClick(teamRole)}
                                        >
                                            {editingTeamRoleId === teamRole.id ? '✓' : '✎'}
                                        </button>
                                    </div>
                                    {editingTeamRoleId === teamRole.id ? (
                                        <input
                                            type="text"
                                            value={editedTeamRole?.name}
                                            onChange={(e) => handleTeamRoleChange('name', (e.target.value))}
                                        />    
                                    ) : (
                                        <>
                                        <div>{teamRole.name}</div>
                                        </>
                                    )}
                                    
                                </div>
                            ))}
                            {isAddingNewTeamRole && (
                                <div className={styles.sprint_tile}>
                                <div></div>   
                                <div className={styles.edit_button_container}>
                                    <button
                                        className="edit_button"
                                        onClick={handleSaveNewTeamRole}
                                    >
                                        ✓
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={newTeamRole.name}
                                    onChange={(e) => handleNewTeamRoleChange('name', e.target.value)}
                                />
                                </div>
                            )}
                            <Button className="smallButton button" onClick={handleAddNewTeamRole}>Добавить командную роль</Button>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default TeamRolesPage;