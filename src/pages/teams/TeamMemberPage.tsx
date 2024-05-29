import React, { useContext, useEffect, useState } from 'react';
import styles from './TeamMemberPage.module.css';
import { TeamMember, TeamRole } from '../../shared/api/IResponses'; // Imported necessary types
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from '../../widgets/Layout/Layout';
import Content from '../../widgets/Content/Content';
import BrandLogo from '../../widgets/BrandLogo/BrandLogo';
import PageName from '../../widgets/PageName/PageName';
import Sidebar from '../../widgets/SideBar/SideBar';
import Button from "../../widgets/Button/Button";
import { useNavigate, useParams } from "react-router-dom";

interface TeamRoleWithSelected extends TeamRole {
    selected: boolean;
}

const TeamMemberPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Use destructuring to get `id` directly
    const navigate = useNavigate();
    const { api } = useContext(ApiContext);
    const [error, setError] = useState<string | null>(null);
    const [teamMember, setTeamMember] = useState<TeamMember>();
    const [teamMemberId, setTeamMemberId] = useState<number>(Number(id));
    const [curTeamMemTeamRoles, setCurTeamMemTeamRoles] = useState<TeamRole[]>([]);
    const [allTeamRoles, setAllTeamRoles] = useState<TeamRoleWithSelected[]>([]);

    useEffect(() => {
        if (teamMemberId) {
            loadTeamMember();          // загружаем участника команды
            loadTeamMemTeamRoles();    // загружаем его командные роли
        } else {
            setError('Некорректный участник команды');
        }
    }, [teamMemberId]);

    useEffect(() => {
        loadAllTeamRoles();        // загружаем все командные роли после загрузки командных ролей текущего участника
    }, [curTeamMemTeamRoles]);

    const handleSaveClick = () => {
        // Implement save functionality here
    };

    const loadAllTeamRoles = () => {
        api.teamRoles.getTeamRoles()
            .then((teamRoles) => {
                const rolesWithSelected = teamRoles.map((role: TeamRole) => ({
                    ...role,
                    selected: curTeamMemTeamRoles.some((curRole) => curRole.id === role.id)
                }));

                setAllTeamRoles(rolesWithSelected);
            })
            .catch((err) => {
                console.error('Failed to fetch team roles', err);
                setError('Ошибка при получении информации о командных ролях');
            });
    };

    const loadTeamMemTeamRoles = () => {
        api.teamRoles.getTeamRolesByTeamMemId(teamMemberId)
            .then((teamRoles) => {
                setCurTeamMemTeamRoles(teamRoles);
            })
            .catch((err) => {
                console.error('Failed to fetch team roles', err);
                setError('Ошибка при получении информации о командных ролях');
            });
    };

    const loadTeamMember = () => {
        api.teamRoles.getTeamMember(teamMemberId)
            .then((teamMember) => {
                setTeamMember(teamMember);
            })
            .catch((err) => {
                console.error('Failed to fetch team member', err);
                setError('Ошибка при получении участника команды');
            });
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Информация об участнике команды" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.sprints} />}
            bottomRight={
                <Content>
                    {error && <div className="error-message">{error}</div>}
                    <Button onClick={() => navigate(-1)}>Назад</Button>  {/*Реализовать возвращение назад */}
                    <div className={styles.profileInfo}>
                        <h2>Пользователь {teamMember?.fullName}</h2>
                        <div className={styles.sprints_grid}>
                            <div className={styles.sprints_grid_header}>
                                <div>Выбрать</div>
                                <div>Название</div>
                            </div>
                            {allTeamRoles.map((role, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <label className={styles.checkbox_container}>
                                        <input 
                                            type="checkbox" 
                                            checked={role.selected}
                                            onChange={(e) => {
                                                const newTeamRoles = [...allTeamRoles];
                                                newTeamRoles[index].selected = e.target.checked;
                                                setAllTeamRoles(newTeamRoles);
                                            }}
                                        />
                                        <span className={styles.checkmark}></span>
                                    </label>
                                    <div className={styles.tile_content}>
                                        <div>{role.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleSaveClick}>Сохранить</Button>
                </Content>
            }
        />
    );
}

export default TeamMemberPage;