import React, { useContext, useEffect, useState } from 'react';
import styles from './UsersPage.module.css';
import { Task } from '../../shared/api/IResponses';
import { UserInfo } from '../../shared/api/IResponses';
import { format } from 'date-fns';
import ApiContext from "../../features/api-context";
import { RoutePaths } from "../../shared/config/routes";
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import Sidebar from "../../widgets/SideBar/SideBar";

const UsersPage: React.FC = () => {
    const { api } = useContext(ApiContext);

    const [users, setUsers] = useState<UserInfo[]>([]);
    const [error, setError] = useState<string | null>(null);

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
                                <div>ФИО</div>
                                <div>Email</div>
                                <div>Номер телефона</div>
                                <div>Роль</div>
                            </div>
                            {users.map((user, index) => (
                                <div key={index} className={styles.sprint_tile}>
                                    <div>{user.fullName}</div>
                                    <div>{user.email}</div>
                                    <div>{user.phone_number}</div>
                                    <div></div>
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