import { useNavigate, useLocation  } from 'react-router-dom';
import appsIcon from '../shared/ui/icons/apps.png';
import profileIcon from '../shared/ui/icons/profile.png';
import sprintIcon from '../shared/ui/icons/sprint.png';

export interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  subItems?: { label: string; onClick: () => void }[];
}

const SliderItemsGenerator = (): MenuItem[] => {
  const navigate = useNavigate();

  const location = useLocation();

  if (location.pathname === '/profile') {
    return [
      {
        label: 'Команды',
        icon: appsIcon,
        onClick: () => { navigate('/available-teams'); },
        subItems: [],
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
        onClick: () => { navigate('/available-teams'); },
        subItems: [
          { label: 'Team 1', onClick: () => alert('Team 1') },
          { label: 'Team 2', onClick: () => alert('Team 2') },
          { label: 'Team 9', onClick: () => alert('Team 9') }
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