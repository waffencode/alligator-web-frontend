import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Team, 
    TeamRole, 
    TeamRolesResponse, 
    TeamMemberRole,
    TeamMemberRolesResponse,
    SprintTaskRolesResponse,
    SprintTaskRole 
} from "./IResponses";

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

    public async deleteTeamRole(teamRole: TeamRole): Promise<TeamRole> {
        // TODO: удалить роль у пользователей team_member_roles
        const teamMemberRoleGetResp = await this.fetchJson<TeamMemberRolesResponse>(`/teamMemberRoles?teamRoleId=`+teamRole.id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const teamMemberRoles = teamMemberRoleGetResp._embedded.teamMemberRoles;
        for (const teamMemberRole of teamMemberRoles) {
            this.deleteTeamMemberRoleById(teamMemberRole.id);
        }

        // TODO: удалить роль у задач sprint_task_roles
        const sprintTaskRolesGetResp = await this.fetchJson<SprintTaskRolesResponse>(`/sprintTaskRoles?teamRoleId=` + teamRole.id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const sprintTaskRoles = sprintTaskRolesGetResp._embedded.sprintTaskRoles;
        for (const sprintTaskRole of sprintTaskRoles) {
            this.deleteSprintTaskRoleById(sprintTaskRole.id);
        }

        const deletedTeamRole = await this.fetchJson<TeamRole>(`/teamRoles/`+teamRole.id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return deletedTeamRole;
    }

    public async deleteTeamMemberRoleById(teamMemberRoleId: number): Promise<TeamMemberRole> {
        const deleteTeamMemberRole = await this.fetchJson<TeamMemberRole>(`/teamMemberRoles/` + teamMemberRoleId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return deleteTeamMemberRole;
    }

    public async deleteSprintTaskRoleById(sprintTaskRoleId: number): Promise<SprintTaskRole> {
        const deleteSprintTaskRole = await this.fetchJson<SprintTaskRole>(`/sprintTaskRoles/` + sprintTaskRoleId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return deleteSprintTaskRole;
    }

   
}
