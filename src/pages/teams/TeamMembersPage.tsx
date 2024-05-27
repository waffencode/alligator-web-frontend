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
import { UserInfo } from '../../shared/api/IResponses';

const TeamMembersPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { api } = useContext(ApiContext);
    const navigate = useNavigate();
    const [team, setTeam] = useState<any>(null);
    const [members, setMembers] = useState<UserInfo[]>([]);
    const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
    const [newMemberId, setNewMemberId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.team.getTeamById(id)
                .then((team) => {
                    setTeam(team);
                    setMembers(team.members);
                })
                .catch((err) => {
                    console.error('Failed to fetch team details', err);
                    setError('Failed to load team details');
                });

            api.user.getAllUsersInfoWithRoles()
                .then((response: UserInfo[]) => {
                    setAllUsers(response);
                })
                .catch((err: Error) => {
                    console.error('Failed to fetch users with roles', err);
                });
        }
    }, [api.team, api.user, id]);

    const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        api.team.addMemberToTeam(id, newMemberId)
            .then(() => {
                const newMember = allUsers.find(user => user.id === newMemberId);
                if (newMember) {
                    setMembers([...members, newMember]);
                    setSuccessMessage('Member added successfully!');
                    setNewMemberId('');
                }
            })
            .catch((err) => {
                console.error('Failed to add member', err);
                setError('Failed to add member');
            });
    };

    const handleRemoveMember = (memberId: string) => {
        setError(null);
        setSuccessMessage(null);

        api.team.removeMemberFromTeam(id, memberId)
            .then(() => {
                setMembers(members.filter(member => member.id !== memberId));
                setSuccessMessage('Member removed successfully!');
            })
            .catch((err) => {
                console.error('Failed to remove member', err);
                setError('Failed to remove member');
            });
    };

    const handleEditTeamName = () => {
        // Implement edit team name logic
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
                            <h2>{team.name}</h2>
                            <button onClick={handleEditTeamName}>Редактировать название</button>
                        </div>
                        <div className="members-list">
                            {members.map(member => (
                                <div key={member.id} className={`member-tile ${member.isTeamLead ? 'team-lead' : ''}`}>
                                    <span>{member.fullName}</span>
                                    <button onClick={() => handleRemoveMember(member.id)}>Удалить</button>
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
                                        onChange={(e) => setNewMemberId(e.target.value)}
                                        required
                                    >
                                        <option value="">Выберите участника</option>
                                        {allUsers.filter(user => !members.some(member => member.id === user.id)).map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="add-button">Добавить</button>
                            </form>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default TeamMembersPage;
