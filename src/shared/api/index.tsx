import {UserProfile, AuthResponse, whoamiResponse, UserInfoResponse, UserProfileWithRoles, TeamResponse, TeamMembersResponse, Team} from './IResponses'

const API_URL = 'http://194.87.234.28:8080';
//const API_URL = 'http://localhost:8080';

async function fetchJson<T>(url: string, options: RequestInit): Promise<T> {
    //console.log(options);
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && (contentType.includes('application/json') || contentType.includes('application/hal+json'))) {
        return response.json();
    } else {
        //console.log("text");
        return response.text() as unknown as T; // Преобразование текста к типу T
    }
}


// Получение команд, доступных для обычного пользователя
export async function getTeamsByUserIdWithCountOfMembers(token: string): Promise<Team[]> {
    const whoamiResp = await whoami(token);
    const userId = whoamiResp.id;

    const teamResp = await getTeamsByUserId(token, userId);
    const teams = teamResp._embedded.teams;

    // для каждой команды вычисляем количество участников
    for (const team of teams) {
        const teamMembers = await getTeamMembers(token, team.id);
        const memberCount = countTeamMembers(teamMembers);
        team.memberCount = memberCount;
    }

    return teams;
}

export async function getTeamsByUserId(token: string, userId: number): Promise<TeamResponse> {
    return fetchJson<TeamResponse>(`${API_URL}/teams?user.id=`+userId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}


// Получение списка участников конкретной команды
export async function getTeamMembers(token: string, teamId: number): Promise<TeamMembersResponse> {
    return fetchJson<TeamMembersResponse>(`${API_URL}/teamMembers?team.id=`+teamId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// Подсчёт количества членов команды
function countTeamMembers(teamMembers: TeamMembersResponse): number {
    const count = 0; 
    return teamMembers.page.totalElements;
}


// Получение списка спринтов конкретной команды
export async function getSprintsByUserId(token: string): Promise<Team[]> {
    const whoamiResp = await whoami(token);
    const userId = whoamiResp.id;

    const teamResp = await getTeamsByUserId(token, userId);
    const teams = teamResp._embedded.teams;

    // для каждой команды вычисляем количество участников
    for (const team of teams) {
        const teamMembers = await getTeamMembers(token, team.id);
        const memberCount = countTeamMembers(teamMembers);
        team.memberCount = memberCount;
    }

    return teams;
}


// Получение спринтов обычного пользователя


// Получение задач в конкретном спринте


// Получение информации о пользователе для профиля ProfilePage
export async function getCurUserProfileInfo(token: string): Promise<UserProfileWithRoles> {
    const whoamiResp = await whoami(token);

    const userId = whoamiResp.id;
    const roles = whoamiResp.roles;

    // добавление ролей к запросу
    const getUserInfoesByUserIdResp = await getUserInfoesByUserId(token, userId);

    const userProfileWithRoles: UserProfileWithRoles = {
        ...getUserInfoesByUserIdResp,
        roles
    };

    return userProfileWithRoles;
}

//userInfoes/search/getByUserId?userId={userId}
export async function getUserInfoesByUserId(token: string, userId: number): Promise<UserProfile> {
    // console.log("getUserInfoesByUserId");
    return fetchJson<UserProfile>(`${API_URL}/userInfoes/search/getByUserId?userId=`+userId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

//whoami
export async function whoami(token: string): Promise<whoamiResponse> {
    // console.log("whoami");
    return fetchJson<whoamiResponse>(`${API_URL}/whoami`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// userinfoes
export async function userinfoes(token: string): Promise<UserInfoResponse> {
    return fetchJson<UserInfoResponse>(`${API_URL}/userinfoes`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// login
export async function login(username: string, password: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
}

// register
export async function register(username: string, password: string, fullName: string, email: string, phoneNumber: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, fullName, email, phoneNumber})
    });
}

// changePassword
export async function changePassword(token: string, oldPassword: string, newPassword: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_URL}/changePassword`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword})
    });
}