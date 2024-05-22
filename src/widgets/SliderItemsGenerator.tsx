import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [showTeamCategories, setShowTeamCategories] = useState(false);
  const [selectedTeamCategory, setSelectedTeamCategory] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const toggleTeamCategories = () => {
    setShowTeamCategories(!showTeamCategories);
    setSelectedTeamCategory(null);
    setSelectedTeam(null);
  };

  const selectTeamCategory = (category: string) => {
    if (selectedTeamCategory === category) {
      setSelectedTeamCategory(null);
      setSelectedTeam(null);
    } else {
      setSelectedTeamCategory(category);
      setSelectedTeam(null);
    }
  };

  const selectTeam = (team: string) => {
    if (selectedTeam === team) {
      setSelectedTeam(null);
    } else {
      setSelectedTeam(team);
    }
  };

  const teamsSubItems = [
    { label: 'Team 1', onClick: () => selectTeam('Team 1') },
    { label: 'Team 2', onClick: () => selectTeam('Team 2') },
    { label: 'Team 9', onClick: () => selectTeam('Team 9') },
  ];

  const teamActionsSubItems = [
    { label: 'Состав команды', onClick: () => alert('Состав команды') },
    { label: 'Спринты', onClick: () => alert('Спринты') },
  ];

  const commonItems = [
    {
      label: 'Команды',
      icon: appsIcon,
      onClick: toggleTeamCategories,
      subItems: showTeamCategories ? [] : undefined,
    },
    ...(showTeamCategories
      ? [
          {
            label: 'Доступные',
            onClick: () => selectTeamCategory('Доступные'),
            subItems: selectedTeamCategory === 'Доступные' ? teamsSubItems : undefined,
          },
          {
            label: 'Участия',
            onClick: () => alert('Участия'),
          },
          {
            label: 'Организуемые',
            onClick: () => alert('Организуемые'),
          },
          {
            label: 'Создание',
            onClick: () => alert('Создание'),
          },
        ]
      : []),
    {
      label: 'Спринты',
      icon: sprintIcon,
      onClick: () => {},
      subItems: [],
    },
    {
      label: 'Профиль',
      icon: profileIcon,
      onClick: () => {
        navigate('/profile');
      },
    },
  ];

  if (selectedTeam) {
    return [
      {
        label: selectedTeam,
        icon: appsIcon,
        onClick: () => {},
        subItems: teamActionsSubItems,
      },
      ...commonItems,
    ];
  }

  return commonItems;
};

export { SliderItemsGenerator };
