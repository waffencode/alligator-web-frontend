import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Sprint} from "./IResponses";

export class SprintApi extends BaseApi {
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    public async getSprintsByTeamId(teamId: number): Promise<Sprint[]> {

        const sprints = await this.fetchJson<Sprint[]>(`/sprints?teamId=1`+teamId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return sprints;
    }

// Получение спринтов обычного пользователя
    public async getSprintsOfCurrentUser(): Promise<Sprint[]> {
        const userId = this.authenticationContext.userId;

        if(userId === undefined) {
            throw Error("getSprintsByUserId: Authentication error")
        }

        const sprints = await this.fetchJson<Sprint[]>(`/sprints/findAllWhereUserIsTeamMember?userId=`+userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return sprints;
    }
}