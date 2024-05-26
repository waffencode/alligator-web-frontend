import { AuthenticationContextData } from '../shared/lib/authentication';
import {AuthApi} from '../shared/api/AuthApi';
import {ProfileApi} from "../shared/api/ProfileApi";
import {UserApi} from "../shared/api/UserApi";
import {SprintApi} from "../shared/api/SprintApi";
import {TaskApi} from "../shared/api/TaskApi";
import {TeamApi} from "../shared/api/TeamApi";

type setAuthenticationContextData = (context: AuthenticationContextData) => void;

class Api {
    auth: AuthApi;
    profile: ProfileApi;
    user: UserApi;
    sprint: SprintApi;
    tasks: TaskApi;
    team: TeamApi;

    _authenticationContext: AuthenticationContextData;
    _setAuthenticationContext: setAuthenticationContextData;

    constructor(setAuthenticationContextData: setAuthenticationContextData, authenticationContext: AuthenticationContextData) {
        this._authenticationContext = authenticationContext;
        this._setAuthenticationContext = setAuthenticationContextData;

        this.auth = new AuthApi();
        this.user = new UserApi(this._authenticationContext);
        this.profile = new ProfileApi(this._authenticationContext, this.user);
        this.sprint = new SprintApi(this._authenticationContext);
        this.tasks = new TaskApi(this._authenticationContext);
        this.team = new TeamApi(this._authenticationContext);
    }

    isLoggedIn(): boolean {
        return this._authenticationContext?.accessToken != null && this._authenticationContext?.accessToken != '';
    }

    // // NOTE: token invalid => reset token context
    // async withReauth<T, U>(func: () => Promise<AxiosResponse<T, U>>): Promise<AxiosResponse<T, U>> {
    //     return func().catch(async (e) => {
    //         if (e.response != undefined && e.response.status == 401) {
    //             this._setTokenContext(new TokenContextData());
    //         }
    //         throw e;
    //     });
    // }
}

export { Api };
export type { setAuthenticationContextData };
