import { AuthenticationContextData } from '../shared/lib/authentication';
import {AuthApi} from '../shared/api/AuthApi';
import {ProfileApi} from "../shared/api/ProfileApi";
import {UserApi} from "../shared/api/UserApi";
import {SprintApi} from "../shared/api/SprintApi";
import {TaskApi} from "../shared/api/TaskApi";
import {TeamApi} from "../shared/api/TeamApi";
import { SprintTaskApi } from '../shared/api/SprintTaskApi';
import { TeamRolesApi } from '../shared/api/TeamRolesApi';

type setAuthenticationContextData = (context: AuthenticationContextData) => void;

class Api {
    auth: AuthApi;
    profile: ProfileApi;
    user: UserApi;
    sprint: SprintApi;
    tasks: TaskApi;
    team: TeamApi;
    sprintTask: SprintTaskApi;
    teamRoles: TeamRolesApi;

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
        this.sprintTask = new SprintTaskApi(this._authenticationContext, this.tasks);
        this.teamRoles = new TeamRolesApi(this._authenticationContext);
    }

    isLoggedIn(): boolean {
        return this._authenticationContext?.accessToken != null && this._authenticationContext?.accessToken != '';
    }
}

export { Api };
export type { setAuthenticationContextData };
