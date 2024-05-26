
import React, {useContext, useEffect, useState} from 'react';
import Sidebar from '../../widgets/Sidebar';
import styles from './ProfilePage.module.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import { useNavigate } from 'react-router-dom';
import { SliderItemsGenerator } from '../../widgets/SliderItemsGenerator';
import { rolesTranslator } from '../../entities/RolesTranslator';
import Layout from "../../widgets/Layout/Layout";
import Content from "../../widgets/Content/Content";
import BrandLogo from "../../widgets/BrandLogo/BrandLogo";
import PageName from "../../widgets/PageName/PageName";
import ApiContext from "../../features/api-context";

const ProfilePage: React.FC = () => {
    const {api} = useContext(ApiContext);

    const menuItems = SliderItemsGenerator(); // Получаем элементы меню
    const navigate = useNavigate(); // используем useNavigate вместо navigator

    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<string>('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    // TODO: move out to api, maybe transform to hook
    useEffect(() => {
        api.profile.getCurUserProfileInfo()
            .then((profile) => {
                setFullName(profile.fullName);
                setRole(rolesTranslator(profile.roles));
                setPhone(profile.phone_number);
                setEmail(profile.email);
            })
            .catch((err) => {
                console.error('Failed to fetch user profile', err);
                setError('Failed to load user profile');
            });
    }, []);

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Профиль" />}
            bottomLeft={<Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />}
            bottomRight={
                <Content>
                    {error ? ( <div className="error-message">{error}</div>) : ("")}
                    <div className={styles.profile_info}>
                        <div className={styles.profile_info_row}>
                            <label>ФИО:</label><span>{fullName}</span>
                        </div>
                        <div className={styles.profile_info_row}>
                            <label>Основная роль:</label><span>{role}</span>
                        </div>
                        <div className={styles.profile_info_row}>
                            <label>Email:</label><span>{email}</span>
                        </div>
                        <div className={styles.profile_info_row}>
                            <label>Номер телефона:</label><span>{phone}</span>
                        </div>
                        <div className={styles.profile_info_row}>
                            <label>Смена пароля:</label><button onClick ={() => navigate("/change-password")}>Сменить пароль</button>
                        </div>
                    </div>
                </Content>
            }
        />
    );
};

export default ProfilePage;
