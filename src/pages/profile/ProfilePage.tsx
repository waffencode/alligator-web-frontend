import React from 'react';
import Sidebar from '../../widgets/Sidebar';
import './Profile.css';
import alligatorIcon from '../../shared/ui/icons/alligator.png';
import appsIcon from '../../shared/ui/icons/apps.png';
import profileIcon from '../../shared/ui/icons/profile.png';
import sprintIcon from '../../shared/ui/icons/sprint.png';

const Profile: React.FC = () => {
  const menuItems = [
    {
      label: 'Команды',
      icon: appsIcon,
      onClick: () => {},
      subItems: [
        { label: 'Team 1', onClick: () => alert('Team 1') },
        { label: 'Team 2', onClick: () => alert('Team 2') },
        { label: 'Team 3', onClick: () => alert('Team 3') }
      ],
    },
    {
      label: 'Спринты',
      icon: sprintIcon,
      onClick: () => {},
      subItems: [
        { label: 'Sprint 1', onClick: () => alert('Sprint 1') },
        { label: 'Sprint 2', onClick: () => alert('Sprint 2') },
        { label: 'Sprint 3', onClick: () => alert('Sprint 3') }
      ],
    },
    {
      label: 'Профиль',
      icon: profileIcon,
      onClick: () => alert('Профиль'),
    },
  ];

  const [fullName, setFullname] = React.useState('Иван Иванов');
  const [role, setRole] = React.useState('Разработчик');
  const [phone, setPhone] = React.useState('+7 (999) 999-99-99');
  const [email, setEmail] = React.useState('ivan.ivanov@example.com');

  return (
    <div className="profile-page">
      <Sidebar menuItems={menuItems} headerIcon={alligatorIcon} />
      <div className="profile-content">
        <h1>Профиль</h1>
        <div className="profile-info">
          <div className="profile-info-row">
            <label>ФИО:</label><span>{fullName}</span>
          </div>
          <div className="profile-info-row">
            <label>Основная роль:</label><span>{role}</span>
          </div>
          <div className="profile-info-row">
            <label>Номер телефона:</label><span>{phone}</span>
          </div>
          <div className="profile-info-row">
            <label>Email:</label><span>{email}</span>
          </div>
          <div className="profile-info-row">
            <label>Смена пароля:</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
