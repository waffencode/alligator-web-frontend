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

// Интерфейс для ссылки
interface Link {
    href: string;
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

interface TeamWithCountOfMembers extends Team {
    countOfMembers: number;
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
    state: string;
    _links: TeamMemberLinks;
}

// Интерфейс для _embedded части ответа
interface EmbeddedTeamMembers {
    teamMembers: TeamMember[];
}

// Основной интерфейс для ответа от сервера
interface TeamMembersResponse {
    _embedded: EmbeddedTeamMembers;
    _links: TopLevelLinks;
    page: PageInfo;
}

// sprints

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

interface Sprint {
    id: number;
    team: Team_sprints;
    scrumMaster: ScrumMaster;
    startTime: string;
    endTime: string;
    sp: number;
    name: string;
    state: string;
}

interface SprintResponse {
    sprints: Sprint[];
}

export type { UserProfile, AuthResponse, whoamiResponse, UserInfoResponse, UserProfileWithRoles, TeamResponse, TeamMembersResponse, Team, SprintResponse};