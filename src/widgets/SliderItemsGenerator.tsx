export {}

// import {useState, useEffect, useContext} from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import appsIcon from '../shared/ui/icons/apps.png';
// import profileIcon from '../shared/ui/icons/profile.png';
// import sprintIcon from '../shared/ui/icons/sprint.png';
// import { Sprint, Team } from '../shared/api/IResponses';
// import ApiContext from "../features/api-context";
//
// export interface MenuItem {
//   label: string;
//   icon?: string;
//   onClick: () => void;
//   subItems?: MenuItem[];
// }
//
// const SliderItemsGenerator = (): MenuItem[] => {
//   const {api} = useContext(ApiContext);
//
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showAvailableTeams, setShowAvailableTeams] = useState(false);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [sprints, setSprints] = useState<Sprint[]>([]);
//   const [roles, setRoles] = useState<string[]>([]);
//
//   useEffect(() => {
//     // получаем роли
//     const token = localStorage.getItem('token');
//     if (token) {
//         api.user.whoami()
//         .then((whoamiResp) => {
//             setRoles(whoamiResp.roles);
//         })
//         .catch((err) => {
//             console.error('Failed to fetch user roles', err);
//         });
//     } else {
//       console.error('No authentication token found');
//     }
//   }, []);
//
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       if (roles.includes("USER")) {
//         // если USER
//         api.team.getTeamsOfCurrentUserWithMemberCount()
//           .then((teams) => {
//             setTeams(teams); // список команд, доступных USER
//           })
//           .catch((err) => {
//             console.error('Failed to fetch user teams', err);
//           });
//         api.sprint.getSprintsOfCurrentUser()
//         .then((sprints) => {
//           setSprints(sprints); // список спринтов, доступных USER
//         })
//         .catch((err) => {
//           console.error('Failed to fetch user sprints', err);
//         });
//       }
//     }
//     // если BUSINESS_ANALYTIC
//
//     // если PROJECT_MANAGER
//
//     else {
//       console.log('No authentication token found');
//     }
//   }, [roles]);
//
//   // если USER
//   if (roles.includes("USER")) {
//     if (location.pathname === '/profile') {
//       return [
//         {
//           label: 'Команды',
//           icon: appsIcon,
//           onClick: () => setShowAvailableTeams(!showAvailableTeams),
//           subItems: showAvailableTeams ? [
//             {
//               label: 'Доступные',
//               onClick: () => { navigate('/available-teams'); },
//               subItems: [],
//             },
//           ] : [],
//         },
//         {
//           label: 'Спринты',
//           icon: sprintIcon,
//           onClick: () => { navigate('/sprints'); },
//           subItems: [],
//         },
//         {
//           label: 'Профиль',
//           icon: profileIcon,
//           onClick: () => { navigate('/profile'); },
//         },
//       ];
//     } else if (location.pathname === '/available-teams') {
//
//       const availableTeamsSubItems: MenuItem[] = teams.map((team) => ({
//         label: team.name,
//         onClick: () => alert(`Team ${team.name}`),
//       }));
//
//       return [
//         {
//           label: 'Команды',
//           icon: appsIcon,
//           onClick: () => {},
//           subItems: [
//             {
//               label: 'Доступные',
//               onClick: () => {navigate('/available-teams');},
//               subItems: availableTeamsSubItems,
//             },
//             ...availableTeamsSubItems, // Добавляем команды прямо в основное меню
//           ],
//         },
//         {
//           label: 'Спринты',
//           icon: sprintIcon,
//           onClick: () => { navigate('/sprints') },
//           subItems: [],
//         },
//         {
//           label: 'Профиль',
//           icon: profileIcon,
//           onClick: () => { navigate('/profile'); },
//         },
//       ];
//     } else if (location.pathname === '/sprints') {
//
//       const availableSprintsSubItems: MenuItem[] = sprints.map((sprint) => ({
//         label: sprint.name,
//         onClick: () => alert(`Team ${sprint.name}`),
//       }));
//
//       return [
//         {
//           label: 'Команды',
//           icon: appsIcon,
//           onClick: () => setShowAvailableTeams(!showAvailableTeams),
//           subItems: showAvailableTeams ? [
//             {
//               label: 'Доступные',
//               onClick: () => { navigate('/available-teams'); },
//               subItems: [],
//             },
//           ] : [],
//         },
//         {
//           label: 'Спринты',
//           icon: sprintIcon,
//           onClick: () => { navigate('/sprints') },
//           subItems: availableSprintsSubItems,
//         },
//         {
//           label: 'Профиль',
//           icon: profileIcon,
//           onClick: () => { navigate('/profile'); },
//         },
//       ];
//
//     } else {
//       return [
//         {
//           label: 'Профиль',
//           icon: profileIcon,
//           onClick: () => { navigate('/profile'); },
//         },
//       ];
//     }
//   } else if (roles.includes("BUSINESS_ANALYTIC")) {     // если BUSINESS_ANALYTIC
//     if (location.pathname === '/profile' || location.pathname === '/backlog') {
//       return [
//         {
//           label: 'Бэклог',
//           icon: sprintIcon,
//           onClick: () => { navigate('/backlog'); },
//           subItems: [],
//         },
//         {
//           label: 'Профиль',
//           icon: profileIcon,
//           onClick: () => { navigate('/profile'); },
//         },
//       ];
//     } else {
//       return [
//         {
//           label: 'Профиль',
//           icon: profileIcon,
//           onClick: () => { navigate('/profile'); },
//         },
//       ];
//     }
//
//  // } else if (roles.includes("PROJECT_MANAGER")) {     // если PROJECT_MANAGER
//
//   } else {
//     return [
//       {
//         label: 'Профиль',
//         icon: profileIcon,
//         onClick: () => { navigate('/profile'); },
//       },
//     ];
//   }
// };
//
// export { SliderItemsGenerator };