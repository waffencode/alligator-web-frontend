import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import appsIcon from '../shared/ui/icons/apps.png';
import profileIcon from '../shared/ui/icons/profile.png';
import sprintIcon from '../shared/ui/icons/sprint.png';
import { getTeamsByUserIdWithCountOfMembers } from '../shared/api';
import { Team } from '../shared/api/IResponses';

export interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  subItems?: MenuItem[];
}

const SliderItemsGenerator = (): MenuItem[] => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAvailableTeams, setShowAvailableTeams] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getTeamsByUserIdWithCountOfMembers(token)
        .then((teams) => {
          setTeams(teams);
        })
        .catch((err) => {
          console.error('Failed to fetch user profile', err);
        });
    } else {
      console.log('No authentication token found');
    }
  }, []); // Пустой массив зависимостей, чтобы вызвать эффект только при монтировании компонента

  if (location.pathname === '/profile') {
    return [
      {
        label: 'Команды',
        icon: appsIcon,
        onClick: () => setShowAvailableTeams(!showAvailableTeams),
        subItems: showAvailableTeams ? [
          {
            label: 'Доступные',
            onClick: () => { navigate('/available-teams'); },
            subItems: [],
          },
        ] : [],
      },
      {
        label: 'Спринты',
        icon: sprintIcon,
        onClick: () => {},
        subItems: [],
      },
      {
        label: 'Профиль',
        icon: profileIcon,
        onClick: () => { navigate('/profile'); },
      },
    ];
  } else if (location.pathname === '/available-teams') {


/*
    const availableTeamsSubItems: MenuItem[] = [
      { label: 'Team 1', onClick: () => alert('Team 1') },
      { label: 'Team 2', onClick: () => alert('Team 2') },
      { label: 'Team 3', onClick: () => alert('Team 3') }
    ];
*/

    const availableTeamsSubItems: MenuItem[] = teams.map((team) => ({
      label: team.name,
      onClick: () => alert(`Team ${team.name}`),
    }));

    return [
      {
        label: 'Команды',
        icon: appsIcon,
        onClick: () => {},
        subItems: [
          {
            label: 'Доступные',
            onClick: () => {},
            subItems: availableTeamsSubItems,
          },
          ...availableTeamsSubItems, // Добавляем команды прямо в основное меню
        ],
      },
      {
        label: 'Спринты',
        icon: sprintIcon,
        onClick: () => {},
        subItems: [],
      },
      {
        label: 'Профиль',
        icon: profileIcon,
        onClick: () => { navigate('/profile'); },
      },
    ];
  } else {
    return [
      {
        label: 'Профиль',
        icon: profileIcon,
        onClick: () => { navigate('/profile'); },
      },
    ];
  }
};

export { SliderItemsGenerator };