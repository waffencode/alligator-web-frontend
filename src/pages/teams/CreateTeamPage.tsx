import React, { useContext, useState } from 'react';
import './CreateTeamPage.css';
import { useNavigate } from 'react-router-dom';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import Content from "../../widgets/Content/Content";
import Layout from "../../widgets/Layout/Layout";

const CreateTeamPage: React.FC = () => {
    const { api } = useContext(ApiContext);
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState<string>('');
    const [teamLeadName, setTeamLeadName] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value);
    };

    const handleTeamLeadNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamLeadName(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        
        const teamLeadUserId = getUserIdFromTeamLeadName(teamLeadName);

        // api.team.createTeam({ name: teamName, user_id: teamLeadUserId })
        //     .then(() => {
        //         setSuccessMessage('Team created successfully!');
        //         setTeamName('');
        //         setTeamLeadName('');
        //     })
        //     .catch((err: Error) => {
        //         console.error('Failed to create team', err);
        //         setError('Failed to create team');
        //     });
    };

    
    const getUserIdFromTeamLeadName = (name: string): string => {
        
        return '12345'; // Example user_id
    };

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Создание команды" />}
            bottomLeft={<Sidebar currentPageURL={RoutePaths.createTeam} />}
            bottomRight={
                <Content>
                    <div className="create-team-page">
                        <div className="team-form-content">
                            {successMessage && <div className="success-message">{successMessage}</div>}
                            {error && <div className="error-message">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="teamName">Название команды:</label>
                                    <input
                                        type="text"
                                        id="teamName"
                                        value={teamName}
                                        onChange={handleTeamNameChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="teamLeadName">ФИО тимлида:</label>
                                    <input
                                        type="text"
                                        id="teamLeadName"
                                        value={teamLeadName}
                                        onChange={handleTeamLeadNameChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="create-button">Создать</button>
                            </form>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default CreateTeamPage;
