interface AuthResponse {
    token: string;
}

interface whoamiResponse {
    id: number;
    username: string;
    roles: []
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


export type {UserProfile, AuthResponse, whoamiResponse, UserInfoResponse, UserProfileWithRoles};