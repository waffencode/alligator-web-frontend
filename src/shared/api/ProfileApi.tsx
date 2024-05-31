import {BaseApi} from "./BaseApi";
import {UserProfileWithRoles} from "./IResponses";
import {UserApi} from "./UserApi";
import {AuthenticationContextData, getAuthenticationContextData} from "../lib/authentication";


export class ProfileApi extends BaseApi {
    private userApi: UserApi;
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData, userApi: UserApi) {
        super();
        this.authenticationContext = authenticationContext;
        this.userApi = userApi;
    }

    public async getCurUserProfileInfo(): Promise<UserProfileWithRoles> {
        if(this.authenticationContext._roles === undefined || this.authenticationContext._userId === undefined) {
            throw Error("getCurUserProfileInfo: authentication error!")
        }

        const userId =  this.authenticationContext._userId;
        const roles = this.authenticationContext._roles;

        // добавление ролей к запросу
        const getUserInfoesByUserIdResp = await this.userApi.getUserInfoesByUserId(userId);

        const userProfileWithRoles: UserProfileWithRoles = {
            ...getUserInfoesByUserIdResp,
            roles
        };

        return userProfileWithRoles;
    }
}