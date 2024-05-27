import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ApiContext from "../../features/api-context";
import Layout from "../../widgets/Layout/Layout";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import Content from "../../widgets/Content/Content";
import { RoutePaths } from "../../shared/config/routes";
import './TeamMembersPage.css'

const TeamMembersPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { api } = useContext(ApiContext);
    const navigate = useNavigate();
    const [team, setTeam] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     api.team.getTeamById(id)
    //         .then((team) => {
    //             setTeam(team);
    //         })
    //         .catch((err) => {
    //             console.error('Failed to fetch team details', err);
    //             setError('Failed to load team details');
    //         });
    // }, [id]);

    const handleAddMember = () => {
        // Implement add member logic
    };

    const handleRemoveMember = (memberId: string) => {
        // Implement remove member logic
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
                            {team.members.map((member: any) => (
                                <div key={member.id} className={`member-tile ${member.isTeamLead ? 'team-lead' : ''}`}>
                                    <span>{member.name}</span>
                                    <button onClick={() => handleRemoveMember(member.id)}>Удалить</button>
                                </div>
                            ))}
                        </div>
                        <div className="add-member-container">
                            <button onClick={handleAddMember}>Добавить участника</button>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default TeamMembersPage;
