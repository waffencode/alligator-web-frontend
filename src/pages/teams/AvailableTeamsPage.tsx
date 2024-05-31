import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiContext from "../../features/api-context";
import Layout from "../../widgets/Layout/Layout";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import Content from "../../widgets/Content/Content";
import { RoutePaths } from "../../shared/config/routes";
import { Team } from '../../shared/api/IResponses';
import "./AvaliableTeamsPage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "../../widgets/Button/Button";

const AvailableTeamsPage: React.FC = () => {
    const { api } = useContext(ApiContext);
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.team.getTeamsOfCurrentUserWithMemberCount()
            .then((teams) => {
                setTeams(teams);
            })
            .catch((err) => {
                console.error('Failed to fetch teams', err);
                setError('Ошибка при загрузке команд');
            });
    }, []);

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Доступные команды" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.availableTeams} />}
            bottomRight={
                <Content>
                    <div className="available-teams-page">
                        <div className="teams-content">
                            {error ? (<div className="error-message">{error}</div>) : ('')}
                            <div className="teams-list">
                                {teams.map((team) => (
                                    <div key={team.id} className="team-tile">
                                        <div className="team-info">
                                            <h2>{team.name}</h2>
                                            <p>{team.memberCount} участников</p>
                                        </div>
                                        <Button className="button" onClick={() => navigate(RoutePaths.teamMembers + '/' + team.id.toString())}>Перейти</Button>
                                    </div>
                                ))}
                            </div>
                            <div className="create-team-button-container">
                                <Button className="button" onClick={() => navigate(RoutePaths.createTeam)}>
                                    Создать команду
                                </Button>
                            </div>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default AvailableTeamsPage;
