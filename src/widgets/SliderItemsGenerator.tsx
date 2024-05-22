import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import appsIcon from '../shared/ui/icons/apps.png';
import profileIcon from '../shared/ui/icons/profile.png';
import sprintIcon from '../shared/ui/icons/sprint.png';

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

  const availableTeamsSubItems: MenuItem[] = [
    { label: 'Team 1', onClick: () => alert('Team 1') },
    { label: 'Team 2', onClick: () => alert('Team 2') },
    { label: 'Team 3', onClick: () => alert('Team 3') }
  ];

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
            subItems: availableTeamsSubItems,
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