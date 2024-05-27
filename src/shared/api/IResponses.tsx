// Интерфейс для ссылки
interface Link {
    href: string;
}

// Интерфейс для ролей пользователя
interface UserRoleLinks {
    self: Link;
    userRole: Link;
    user: Link;
    role: Link;
}

interface UserRole {
    id: number;
    name?: string;
    _links: UserRoleLinks;
}

// Интерфейс для _embedded части ответа с ролями пользователя
interface EmbeddedUserRoles {
    userRoles: UserRole[];
}

// Интерфейс для верхнего уровня ссылок в ответе с ролями пользователя
interface UserRolesTopLevelLinks {
    self: Link;
}

// Основной интерфейс для ответа с ролями пользователя
interface UserRolesResponse {
    _embedded: EmbeddedUserRoles;
    _links: UserRolesTopLevelLinks;
}

// Интерфейсы для ответа с дедлайном
interface DeadlineLinks {
    self: Link;
    deadline: Link;
}

interface DeadlineResponse {
    id: number;
    time: string;
    type: string;
    _links: DeadlineLinks;
}

// Интерфейс для задачи
interface Task {
    id: number;
    priority: string;
    state: string;
    headline: string;
    description: string;
    deadline_id?: number;
    deadline_time?: string;
    deadline_type?: string;
    _links?: TaskLinks;
}

// Интерфейс для ссылок в задаче
interface TaskLinks {
    self: Link;
    task: Link;
    deadline: Link;
}

// Интерфейс для _embedded части ответа с задачами
interface EmbeddedTasks {
    tasks: Task[];
}

// Интерфейс для верхнего уровня ссылок в ответе с задачами
interface TasksTopLevelLinks {
    self: Link;
    profile: Link;
}

// Интерфейс для информации о странице в ответе с задачами
interface TasksPageInfo {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

// Основной интерфейс для ответа с задачами
interface TasksResponse {
    _embedded: EmbeddedTasks;
    _links: TasksTopLevelLinks;
    page: TasksPageInfo;
}

// Существующие интерфейсы
interface AuthResponse {
    token: string;
}

interface whoamiResponse {
    id: number;
    username: string;
    roles: string[];
}

interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phone_number: string;
    _links?: Link;
}

interface UserProfileWithRoles extends UserProfile {
    roles: string[];
}

interface UserProfileWithRolesInterfaces extends UserProfile {
    roles: Role[];
}

// Интерфейс для вложенных ссылок в каждом элементе userInfo
interface UserInfoLinks {
    self: Link;
    userInfo: Link;
    user: Link;
}

// Интерфейс для элемента userInfo
interface UserInfo {
    id: number;
    fullName: string;
    email: string;
    phone_number: string | null;
    _links?: UserInfoLinks;
}

interface UserInfoWithRolesInterfaces extends UserInfo {
    roles: Role[];
}

// Интерфейс для _embedded части ответа
interface EmbeddedUserInfoes {
    userInfoes: UserInfo[];
}

// Интерфейс для верхнего уровня ссылок
interface TopLevelLinks {
    self: Link;
    profile: Link;
    search: Link;
}

// Интерфейс для информации о странице
interface PageInfo {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

// Основной интерфейс для ответа от сервера
interface UserInfoResponse {
    _embedded: EmbeddedUserInfoes;
    _links: TopLevelLinks;
    page: PageInfo;
}

// Интерфейс для ссылок в каждом элементе команды
interface TeamLinks {
    self: Link;
    team: Link;
    teamLead: Link;
}

// Интерфейс для элемента команды
interface Team {
    id: number;
    name: string;
    state: string;
    team_lead_id?: number;
    _links?: TeamLinks;
    memberCount?: number;
}

// Интерфейс для _embedded части ответа с командами
interface EmbeddedTeams {
    teams: Team[];
}

// Интерфейс для верхнего уровня ссылок в ответе с командами
interface TeamTopLevelLinks {
    self: Link;
    profile: Link;
}

// Интерфейс для информации о странице в ответе с командами
interface TeamPageInfo {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

// Основной интерфейс для ответа с командами
interface TeamResponse {
    _embedded: EmbeddedTeams;
    _links: TeamTopLevelLinks;
    page: TeamPageInfo;
}

// Интерфейс для вложенных ссылок в каждом элементе teamMember
interface TeamMemberLinks {
    self: Link;
    teamMember: Link;
    team: Link;
    user: Link;
}

// Интерфейс для элемента teamMember
interface TeamMember {
    id: number;
    name?: string;
    state: string;
    _links: TeamMemberLinks;
}

// Интерфейс для _embedded части ответа
interface EmbeddedTeamMembers {
    teamMembers: Team[];
}

// Основной интерфейс для ответа от сервера
interface TeamMembersResponse {
    _embedded: EmbeddedTeamMembers;
    _links: TopLevelLinks;
    page: PageInfo;
}

// Интерфейсы для спринтов

interface TeamLead {
    id: number;
    username: string;
    password: string;
}

interface Team_sprints {
    id: number;
    name: string;
    state: string;
    teamLead: TeamLead;
}

interface User {
    id: number;
    username: string;
    password: string;
}

interface UserResponse {
    id: number;
    username: string;
    password: string;
    _links: UserLinks
}

interface UserLinks {
    self: Link;
    user: Link;
}

interface ScrumMaster {
    id: number;
    team: Team_sprints;
    user: User;
    state: string;
}

interface SprintLinks {
    self: Link;
    sprint: Link;
    team: Link;
    scrumMaster: Link;
}

interface Sprint {
    id: number;
    startTime: string;
    endTime: string;
    sp: number;
    name: string;
    state: string;
    team_id?: number;
    team_name?: string;
    scrumMaster_id?: number;
    scrumMaster_fullName?: string;
    //team: Team_sprints;
    //scrumMaster: ScrumMaster;
    _links?: SprintLinks;
}

// Интерфейсы для _embedded части ответа с спринтами
interface EmbeddedSprints {
    sprints: Sprint[];
}


// Интерфейсы для верхнего уровня ссылок в ответе с спринтами
interface SprintsTopLevelLinks {
    self: Link;
    profile: Link;
    search: Link;
}

// Интерфейсы для информации о странице в ответе с спринтами
interface SprintsPageInfo {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
// Основной интерфейс для ответа с спринтами
interface SprintsResponse {
    _embedded: EmbeddedSprints;
    _links: SprintsTopLevelLinks;
    page: SprintsPageInfo;
}

// Интерфейс для представления информации о профиле пользователя
interface UserInfo_TeamMember {
    id: number;
    user: User;
    fullName: string;
    email: string;
    phone_number: string | null;
}

// Интерфейс для представления роли пользователя
interface UserRoleLinks {
    self: Link;
    role: Link;
}

interface Role {
    id: number;
    name: string;
    _links?: UserRoleLinks;

}


// Интерфейс для представления информации о руководителе команды
interface TeamLead {
    id: number;
    username: string;
    password: string;
}

// Интерфейс для представления информации о команде
interface Team_TeamMember {
    id: number;
    name: string;
    state: string;
    teamLead: TeamLead;
}

// Интерфейс для представления информации об участнике команды
interface TeamMember_TeamMember {
    id: number;
    team: Team_TeamMember;
    user: User;
    state: string;
}

// Интерфейс для представления роли участника команды
interface TeamMemberRole {
    id: number;
    teamMember: TeamMember_TeamMember;
    role: Role;
}

// Основной интерфейс для представления участника команды с ролями
interface TeamMembersResponse_TeamMember {
    userInfo: UserInfo_TeamMember;
    teamMemberRoles: TeamMemberRole[];
}

export type { 
    UserProfile, 
    AuthResponse, 
    whoamiResponse, 
    UserRolesResponse,
    UserRole,
    Role,
    UserInfo,
    UserInfoResponse, 
    UserProfileWithRoles, 
    UserProfileWithRolesInterfaces,
    UserInfoWithRolesInterfaces,
    UserResponse,
    TeamResponse, 
    TeamMembersResponse, 
    TeamMember,
    Team, 
    Team_sprints,
    Sprint, 
    SprintsResponse,
    EmbeddedTeamMembers, 
    TeamMembersResponse_TeamMember, 
    TasksResponse, 
    Task, 
    TaskLinks, 
    EmbeddedTasks, 
    TasksTopLevelLinks, 
    TasksPageInfo,
    DeadlineLinks,
    DeadlineResponse
};