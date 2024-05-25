// Интерфейс для ссылки
interface Link {
    href: string;
}

// Интерфейс для задачи
interface Task {
    id: number;
    priority: string;
    state: string;
    headline: string;
    description: string;
    deadline?: string;
    _links: TaskLinks;
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
    fullName: string;
    email: string;
    phone_number: string;
    _links: Link;
}

interface UserProfileWithRoles extends UserProfile {
    roles: string[];
}

// Интерфейс для вложенных ссылок в каждом элементе userInfo
interface UserInfoLinks {
    self: Link;
    userInfo: Link;
    user: Link;
}

// Интерфейс для элемента userInfo
interface UserInfo {
    fullName: string;
    email: string;
    phone_number: string | null;
    _links: UserInfoLinks;
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
    _links: TeamLinks;
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
    team: Team_sprints;
    scrumMaster: ScrumMaster;
    startTime: string;
    endTime: string;
    sp: number;
    name: string;
    state: string;
    _links?: SprintLinks;
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
interface Role {
    id: number;
    name: string;
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
    UserInfoResponse, 
    UserProfileWithRoles, 
    TeamResponse, 
    TeamMembersResponse, 
    Team, 
    Sprint, 
    EmbeddedTeamMembers, 
    TeamMembersResponse_TeamMember, 
    TasksResponse, 
    Task, 
    TaskLinks, 
    EmbeddedTasks, 
    TasksTopLevelLinks, 
    TasksPageInfo 
};