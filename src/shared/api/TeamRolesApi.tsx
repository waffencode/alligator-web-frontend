import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Team, TeamRole, TeamRolesResponse} from "./IResponses";

export class TeamRolesApi extends BaseApi {
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    public async getTeamRoles(): Promise<TeamRole[]> {
        const resp = this.fetchJson<TeamRolesResponse>(`/teamRoles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return (await resp)._embedded.teamRoles;
    }

    public async updateTeamRole(teamRole: TeamRole): Promise<TeamRole> {
        const name = teamRole.name;
        const updatedTeamRole = await this.fetchJson<TeamRole>(`/teamRoles/`+teamRole.id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        return updatedTeamRole;
    }

    public async createTeamRole(teamRole: TeamRole): Promise<TeamRole> {
        const name = teamRole.name;
        const updatedTeamRole = await this.fetchJson<TeamRole>(`/teamRoles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        return updatedTeamRole;
    }



   
}
