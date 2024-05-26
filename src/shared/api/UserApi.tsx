import {BaseApi} from "./BaseApi";
import {AuthResponse, UserInfoResponse, UserProfile, whoamiResponse} from "./IResponses";
import {getAuthenticationContextData, AuthenticationContextData} from "../lib/token";

export class UserApi extends BaseApi {
    private authenticationContext: AuthenticationContextData

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    public async getUserInfoesByUserId(userId: number): Promise<UserProfile> {
        // console.log("getUserInfoesByUserId");
        return this.fetchJson<UserProfile>(`/userInfoes/search/getByUserId?userId=`+userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async  whoami(): Promise<whoamiResponse> {
        // console.log("whoami");
        return this.fetchJson<whoamiResponse>(`/whoami`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async  userinfoes(): Promise<UserInfoResponse> {
        return this.fetchJson<UserInfoResponse>(`/userinfoes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // changePassword
    public async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
        return this.fetchJson<AuthResponse>(`/changePassword`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword})
        });
    }
}