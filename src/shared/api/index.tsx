import {UserProfile, AuthResponse, whoamiResponse, UserInfoResponse, UserProfileWithRoles} from './IResponses'

const API_URL = 'http://194.87.234.28:8080';
//const API_URL = 'http://localhost:8080';

async function fetchJson<T>(url: string, options: RequestInit): Promise<T> {
    console.log(options);
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


// Получение списка участников конкретной команды


// Получение списка спринтов конкретной команды


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
    console.log(userProfileWithRoles);

    return userProfileWithRoles;
}

//userInfoes/search/getByUserId?userId={userId}
export async function getUserInfoesByUserId(token: string, userId: number): Promise<UserProfile> {
    console.log("getUserInfoesByUserId");
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
    console.log("whoami");
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

// register
export async function changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword})
    });
}