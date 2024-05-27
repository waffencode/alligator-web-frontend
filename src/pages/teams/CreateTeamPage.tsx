import React, { useContext, useEffect, useState } from 'react';
import './CreateTeamPage.css';
import { useNavigate } from 'react-router-dom';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";
import Content from "../../widgets/Content/Content";
import Layout from "../../widgets/Layout/Layout";

interface User {
    id: string;
    name: string;
    fullName: string;
}

const CreateTeamPage: React.FC = () => {
    const { api } = useContext(ApiContext);
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState<string>('');
    const [teamLeadUserId, setTeamLeadUserId] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     if (api.users) {
    //         api.users.getAllUsersInfoWithRoles()
    //             .then((response: User[]) => {
    //                 const mappedUsers = response.map(user => ({
    //                     id: user.id.toString(),
    //                     name: user.fullName
    //                 }));
    //                 setUsers(mappedUsers);
    //             })
    //             .catch((err: Error) => {
    //                 console.error('Failed to fetch users with roles', err);
    //             });
    //     }
    // }, [api.users]);
    

    const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value);
    };

    const handleTeamLeadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTeamLeadUserId(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        api.team.createTeam({ name: teamName, team_lead_id: teamLeadUserId })
            .then(() => {
                setSuccessMessage('Team created successfully!');
                setTeamName('');
                setTeamLeadUserId('');
            })
            .catch((err: Error) => {
                console.error('Failed to create team', err);
                setError('Failed to create team');
            });
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
                                    <label htmlFor="teamLead">Тимлид:</label>
                                    <select
                                        id="teamLead"
                                        value={teamLeadUserId}
                                        onChange={handleTeamLeadChange}
                                        required
                                    >
                                        <option value="">Выберите тимлида</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
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
