import { LocalStorageKeys } from '../config/localstorage';
import { plainToInstance } from 'class-transformer';
import {whoamiResponse} from "../api/IResponses";

const fetchAuthenticationContextDataByToken = (token:string) => {
    return fetch("http://localhost:8080/whoami", {
        method: "GET",
        mode: "cors",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => ({
            username: data.username,
            id: data.id,
            roles: data.roles
        }))
        .catch(error => {
            console.error('Failed to fetch user data:', error);
            return null;
        });
}

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

    initializeData(token: string) {
        fetchAuthenticationContextDataByToken(token).then(userData => {
            if (userData) {
                this._username = userData.username;
                this._userId = userData.id;
                this._roles = userData.roles;
            }
        }).then(() => {console.log("data initialized!")})
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
    const data = localStorage.getItem(LocalStorageKeys.TOKEN);
    if (data != null) {
        const obj: object = JSON.parse(data);
        return plainToInstance(AuthenticationContextData, obj);
    }
    return new AuthenticationContextData();
}

function setAuthenticationContextData(authenticationContext: AuthenticationContextData) {
    const data = JSON.stringify(authenticationContext);
    localStorage.setItem(LocalStorageKeys.TOKEN, data);
}

export { AuthenticationContextData, getAuthenticationContextData, setAuthenticationContextData };
