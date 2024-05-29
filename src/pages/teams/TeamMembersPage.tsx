import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiContext from "../../features/api-context";
import Layout from "../../widgets/Layout/Layout";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import Content from "../../widgets/Content/Content";
import { RoutePaths } from "../../shared/config/routes";
import './TeamMembersPage.css';
import Button from "../../widgets/Button/Button";
import { Team, TeamMember, TeamMembersResponse_TeamMember, UserInfo } from '../../shared/api/IResponses';

const TeamMembersPage: React.FC = () => {
    const id = useParams<{ id: string }>();
    const { api } = useContext(ApiContext);
    const navigate = useNavigate();
    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
    const [newMemberId, setNewMemberId] = useState<number>();
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [teamMembersInfo, setTeamMembersInfo] = useState<TeamMembersResponse_TeamMember[]>([]);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [newTeamName, setNewTeamName] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const pageId = Number(id.id);

            api.team.getTeamById(pageId)
                .then((team) => {
                    setTeam(team);
                })
                .catch((err) => {
                    console.error('Failed to fetch team details', err);
                    setError('Ошибка при загрузке информации о команде');
                });

            api.team.getTeamMembers(pageId)
                .then((teamMembers) => {
                    setMembers(teamMembers._embedded.teamMembers);
                })
                .catch((err) => {
                    console.error('Failed to fetch team members', err);
                    setError('Ошибка при загрузке участников команды!');
                });

            api.user.getAllUsersInfoWithRoles()
                .then((response: UserInfo[]) => {
                    setAllUsers(response);
                })
                .catch((err: Error) => {
                    console.error('Failed to fetch users with roles', err);
                });

            api.team.getTeamMembersInfo(pageId)
                .then((response: TeamMembersResponse_TeamMember[]) => {
                    setTeamMembersInfo(response);
                })
                .catch((err: Error) => {
                    console.error('Failed to fetch team members info', err);
                });
        }
    }, [api.team, api.user, id]);

    const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const pageId = Number(id.id);
        api.team.addMemberToTeam(pageId, newMemberId)
            .then((response: TeamMember) => {
                const newMember = response;
                if (newMember) {
                    setMembers([...members, newMember]);
                    setSuccessMessage('Участник успешно добавлен!');
                    setNewMemberId(undefined);

                    api.team.getTeamMembersInfo(pageId)
                        .then((response: TeamMembersResponse_TeamMember[]) => {
                            setTeamMembersInfo(response);
                        })
                        .catch((err: Error) => {
                            console.error('Failed to fetch team members info', err);
                        });
                }
            })
            .catch((err) => {
                console.error('Failed to add member', err);
                setError('Ошибка при добавлении участника!');
            });
    };

    const handleRemoveMember = (memberId: number) => {
        setError(null);
        setSuccessMessage(null);

        api.team.removeMemberFromTeam(memberId)
            .then(() => {
                setMembers(members.filter(member => member.id !== memberId));
                setSuccessMessage('Участник успешно удалён!');
            })
            .catch((err) => {
                console.error('Failed to remove member', err);
                setError('Ошибка при удалении участника!');
            });
    };

    const handleEditTeamName = () => {
        if (!team) return;

        if (isEditingName) {
            // Save new team name
            api.team.updateTeamName(team.id, newTeamName)
                .then(() => {
                    setTeam({ ...team, name: newTeamName });
                    setIsEditingName(false);
                    setSuccessMessage('Название команды успешно изменено!');
                })
                .catch((err: any) => {
                    console.error('Failed to update team name', err);
                    setError('Ошибка при изменении названия команды!');
                });
        } else {
            // Start editing
            setNewTeamName(team.name);
            setIsEditingName(true);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!team) {
        return <div>Loading...</div>;
    }

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text={`Команда: ${team.name}`} />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.availableTeams} />}
            bottomRight={
                <Content>
                    <div className="team-members-page">
                        <div className="team-info">
                            <h2>
                                {isEditingName ? (
                                    <input
                                        type="text"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                    />
                                ) : (
                                    team.name
                                )}
                            </h2>
                            <Button className="button" onClick={handleEditTeamName}>
                                {isEditingName ? 'Сохранить' : 'Редактировать название'}
                            </Button>
                        </div>
                        <div className="members-list">
                            {members.map(member => (
                                <div key={member.id} className={`member-tile ${team.team_lead_id === member.id ? 'team-lead' : ''}`}>
                                    <span>{teamMembersInfo.find((teamMember) => teamMember.teamMemberId === member.id)?.userInfo.fullName}</span>
                                    <Button className="button-small" onClick={() => handleRemoveMember(member.id)}>Удалить</Button>
                                </div>
                            ))}
                        </div>
                        <div className="add-member-container">
                            {successMessage && <div className="success-message">{successMessage}</div>}
                            {error && <div className="error-message">{error}</div>}
                            <form onSubmit={handleAddMember}>
                                <div className="form-group">
                                    <label htmlFor="newMember">Добавить участника:</label>
                                    <select
                                        id="newMember"
                                        value={newMemberId}
                                        onChange={(e) => setNewMemberId(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">Выберите участника</option>
                                        {allUsers.filter(user => !teamMembersInfo.some(member => member.userInfo.user.id === user.id)).map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="button margin-right">Добавить</Button>
                                <Button className="button" onClick={() => navigate(RoutePaths.availableTeams)}>Назад</Button>
                            </form>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default TeamMembersPage;
