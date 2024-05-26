import {AuthResponse} from "./IResponses";
import {BaseApi} from "./BaseApi";

export class AuthApi extends BaseApi {
    public async login(username: string, password: string): Promise<AuthResponse> {
        return this.fetchJson<AuthResponse>(`/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    }

    public async register(username: string, password: string, fullName: string, email: string, phoneNumber: string): Promise<AuthResponse> {
        return this.fetchJson<AuthResponse>(`/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, fullName, email, phoneNumber})
        });
    }
}