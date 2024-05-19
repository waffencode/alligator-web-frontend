interface UserProfile {
    fullName: string;
    role: string;
    phone: string;
    email: string;
}

interface AuthResponse {
    token: string;
}

//const API_URL = 'http://194.87.234.28:8080';
const API_URL = 'http://localhost:8080';

async function fetchJson<T>(url: string, options: RequestInit): Promise<T> {
    console.log(options);
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text() as unknown as T; // Преобразование текста к типу T
    }
}

export async function getUserProfile(token: string): Promise<UserProfile> {
    return fetchJson<UserProfile>(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

export async function login(username: string, password: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
}

export async function register(username: string, password: string, fullName: string, email: string, phoneNumber: string): Promise<AuthResponse> {
    return fetchJson<AuthResponse>(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, fullName, email, phoneNumber})
    });
}