import {UserProfile, AuthResponse, whoamiResponse, UserInfoResponse, UserProfileWithRoles, TeamMembersResponse, Team, Sprint, TeamResponse} from './IResponses'

//const API_URL = 'http://194.87.234.28:8080';
const API_URL = 'http://localhost:8080';

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


// Получение команд, доступных для обычного пользователя по id
export async function getTeamsByUserIdWithCountOfMembers(token: string): Promise<Team[]> {
    const whoamiResp = await whoami(token);
    const userId = whoamiResp.id;

    const teamMemberResp = await getTeamsIdWhereUserIsMemberyUserId(token, userId);
    
    const teamMemberIds = teamMemberResp._embedded.teamMembers;

    const teams: Team[] = [];

    // для каждого teamMember.id находим команду и вычисляем количество участников
    for (const teamMember of teamMemberIds) {
        const team = await getTeamByTeamMemberId(token, teamMember.id);
        const teamMembers = await getTeamMembers(token, team.id);
        const memberCount = countTeamMembers(teamMembers);
        team.memberCount = memberCount;

        const teamInfo = await getTeamById(token, team.id);
        team.id = teamInfo.id;
        team.name = teamInfo.name;
        team.state = teamInfo.state;
        team._links = teamInfo._links;

        teams.push(team);
        
    }
    return teams;
}

export async function getTeamsIdWhereUserIsMemberyUserId(token: string, userId: number): Promise<TeamMembersResponse> {
    return fetchJson<TeamMembersResponse>(`${API_URL}/teamMembers?user.id=`+userId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

export async function getTeamById(token: string, teamId: number): Promise<Team> {
    return fetchJson<Team>(`${API_URL}/teams/`+teamId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

export async function getTeamByTeamMemberId(token: string, teamId: number): Promise<Team> {
    return fetchJson<Team>(`${API_URL}/teamMembers/`+teamId+`/team`, {
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

// Получение спринтов обычного пользователя
export async function getSprintsByUserId(token: string): Promise<Sprint[]> {
    const whoamiResp = await whoami(token);
    const userId = whoamiResp.id;

    const sprints = await fetchJson<Sprint[]>(`${API_URL}/sprints/findAllWhereUserIsTeamMember?userId=`+userId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return sprints;
}

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