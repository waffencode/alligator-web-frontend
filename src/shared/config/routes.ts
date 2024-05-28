// Перечисление роутов
export enum AppRoutes {
    ROOT = 'root',
    LOGIN = 'login',
    REGISTER = 'register',
    CHANGE_PASSWORD = 'changePassword',
    PROFILE = 'profile',
    AVAILABLE_TEAMS = 'availableTeams',
    SPRINTS = 'sprints',
    BACKLOG = 'backlog',
    USERS = 'users',
    CREATE_TEAM = 'createTeam',
    TEAM_MEMBERS = 'teamMembers',
    SPRINT_TASKS  = 'sprintTasks'
}

// // чтобы не хардкодить шаблонную строку
// // RoutePaths.user.replace(RouteParams.USERNAME, username)
// export enum RouteParams {
//     USERNAME = ':username',
//     EVENT_ID = ':id',
// }

export const RoutePaths: Record<AppRoutes, string> = {
    // Будем отрисовывать в зависимости от параметра.
    [AppRoutes.ROOT]: '/',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.REGISTER]: '/register',
    [AppRoutes.CHANGE_PASSWORD]: '/change-password',
    [AppRoutes.PROFILE]: '/profile',
    [AppRoutes.AVAILABLE_TEAMS]: '/available-teams',
    [AppRoutes.SPRINTS]: '/sprints',
    [AppRoutes.BACKLOG]: '/backlog',
    [AppRoutes.USERS]: '/users',
    [AppRoutes.CREATE_TEAM]: '/createTeam',
    [AppRoutes.TEAM_MEMBERS]: '/teamMembers',
    [AppRoutes.SPRINT_TASKS]: '/sprintTasks'
};
