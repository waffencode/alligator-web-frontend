import { AppRoutes, RoutePaths } from '../shared/config/routes';
import {Route, Routes, Navigate, RouteProps} from 'react-router-dom';
import AuthPage from "../pages/auth/AuthPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AvailableTeamsPage from "../pages/teams/AvailableTeamsPage";
import SprintsPage from "../pages/sprints/SprintsPage";
import BacklogPage from "../pages/backlog/BacklogPage";
import React from "react";
import Authenticated from "../widgets/Authenticated/Authenticated";
import UsersPage from '../pages/users/UsersPage';
import CreateTeamPage from '../pages/teams/CreateTeamPage';
import TeamMembersPage from '../pages/teams/TeamMembersPage';
import SprintTasksPage from "../pages/sprints/SprintTasksPage";
import TeamRolesPage from '../pages/teamRoles/TeamRolesPage';
import TeamMemberPage from '../pages/teams/TeamMemberPage';
interface SecuredRouteProps {
    path?: string;
    authenticated?: boolean;
}

type AppRouteProps = SecuredRouteProps & RouteProps;

// root urls with privileges
const routes: Record<AppRoutes, AppRouteProps> = {
    [AppRoutes.ROOT]: {
        path: RoutePaths.root,
        authenticated: false,
    },
    [AppRoutes.LOGIN]: {
        path: RoutePaths.login,
        authenticated: false,
    },
    [AppRoutes.REGISTER]: {
        path: RoutePaths.register,
        authenticated: false,
    },
    [AppRoutes.CHANGE_PASSWORD]: {
        path: RoutePaths.changePassword,
        authenticated: true
    },
    [AppRoutes.PROFILE]: {
        path: RoutePaths.profile,
        authenticated: true
    },
    [AppRoutes.AVAILABLE_TEAMS]: {
        path: RoutePaths.availableTeams,
        authenticated: true
    },
    [AppRoutes.SPRINTS]: {
        path: RoutePaths.sprints,
        authenticated: true
    },
    [AppRoutes.BACKLOG]: {
        path: RoutePaths.backlog,
        authenticated: true
    },
    [AppRoutes.USERS]: {
        path: RoutePaths.users,
        authenticated: true
    },
    [AppRoutes.CREATE_TEAM]: {
        path: RoutePaths.createTeam,
        authenticated: true
    },
    [AppRoutes.TEAM_MEMBERS]: {
        path: RoutePaths.teamMembers + '/:id',
        authenticated: true
    },
    [AppRoutes.SPRINT_TASKS]: {
    path: RoutePaths.sprintTasks + '/:id',
        authenticated: true
    },
    [AppRoutes.TEAM_ROLES]: {
        path: RoutePaths.teamRoles,
        authenticated: true
    },
    [AppRoutes.TEAM_MEMBER]: {
        path: RoutePaths.teamMember + '/:id',
        authenticated: true
    },
};

// root elements
const routeElements: Record<AppRoutes, AppRouteProps> = {
    [AppRoutes.ROOT]: {
        element: <Navigate to={RoutePaths.login} />,
    },
    [AppRoutes.LOGIN]: {
        element: <AuthPage />
    },
    [AppRoutes.REGISTER]: {
        element: <RegisterPage />
    },
    [AppRoutes.CHANGE_PASSWORD]: {
        element: <ChangePasswordPage />
    },
    [AppRoutes.PROFILE]: {
        element: <ProfilePage />
    },
    [AppRoutes.AVAILABLE_TEAMS]: {
        element: <AvailableTeamsPage />
    },
    [AppRoutes.SPRINTS]: {
        element: <SprintsPage />
    },
    [AppRoutes.BACKLOG]: {
        element: <BacklogPage />
    },
    [AppRoutes.USERS]: {
        element: <UsersPage />
    },
    [AppRoutes.CREATE_TEAM]: {
        element: <CreateTeamPage />
    },
    [AppRoutes.TEAM_MEMBERS]: {
        element: <TeamMembersPage />
    },
    [AppRoutes.SPRINT_TASKS]: {
        element: <SprintTasksPage />
    },
    [AppRoutes.TEAM_ROLES]: {
        element: <TeamRolesPage />
    },
    [AppRoutes.TEAM_MEMBER]: {
        element: <TeamMemberPage />
    }
};

export default function AppRouter() {
    const merged = Object.values(AppRoutes).map((k) => ({ ...routes[k], ...routeElements[k] }) as AppRouteProps);

    return (
        <Routes>
            {merged.map(({ path, element, authenticated }: AppRouteProps) => {
                let e = element;
                if (authenticated) {
                    e = <Authenticated rejectNavigateTo={RoutePaths.login}>{e}</Authenticated>;
                }
                return <Route key={path} path={path} element={e} />;
            })}
        </Routes>
    );
}
