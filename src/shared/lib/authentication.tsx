import { LocalStorageKeys } from '../config/localstorage';
import { plainToInstance } from 'class-transformer';
import {whoamiResponse} from "../api/IResponses";

class AuthenticationContextData {
    _accessToken?: string;
    _username?: string;
    _userId?: number;
    _roles?: Array<string>

    constructor(accessToken?: string,
        username?: string,
        userId?: number,
        roles?: Array<string>
    ) {
        this._accessToken = accessToken;
        this._username = username;
        this._userId = userId;
        this._roles = roles;
    }

    get accessToken() {
        return this._accessToken;
    }

    get username() {
        return this._username;
    }

    get userId() {
        return this._userId;
    }

    get roles() {
        return this._roles;
    }
}

function getAuthenticationContextData() {
    const data = localStorage.getItem(LocalStorageKeys.AUTH);
    if (data != null) {
        const obj: object = JSON.parse(data);
        return plainToInstance(AuthenticationContextData, obj);
    }
    return new AuthenticationContextData();
}

function setAuthenticationContextData(authenticationContext: AuthenticationContextData) {
    const data = JSON.stringify(authenticationContext);
    localStorage.setItem(LocalStorageKeys.AUTH, data);
}

// выход из аккаунта
function logout() {
    localStorage.removeItem(LocalStorageKeys.AUTH);
    window.location.href = '/login';
}

export { AuthenticationContextData, getAuthenticationContextData, setAuthenticationContextData, logout };
