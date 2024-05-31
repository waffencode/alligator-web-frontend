import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Team, TeamMembersResponse, TeamMembersResponse_TeamMember, TeamResponse, 
    TeamMember,
    TeamMemberRole,
    TeamMemberRolesResponse,
    AssignedTasksResponse
} from "./IResponses";

export class TeamApi extends BaseApi {
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    public async getTeamsIdWhereUserIsMemberyUserId(userId: number): Promise<TeamMembersResponse> {
        return this.fetchJson<TeamMembersResponse>(`/teamMembers?user.id=`+userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTeamById(teamId: number): Promise<Team> {
        return this.fetchJson<Team>(`/teams/`+teamId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTeamByTeamMemberId(teamId: number): Promise<Team> {
        return this.fetchJson<Team>(`/teamMembers/`+teamId+`/team`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTeamMembers(teamId: number): Promise<TeamMembersResponse> {
        return this.fetchJson<TeamMembersResponse>(`/teamMembers?team.id=`+teamId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTeamMembersInfo(teamId: number): Promise<TeamMembersResponse_TeamMember[]> {
        return this.fetchJson<TeamMembersResponse_TeamMember[]>(`/teams/`+teamId+`/getTeamMembersInfoAndRoles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public countTeamMembers(teamMembers: TeamMembersResponse): number {
        return teamMembers.page.totalElements;
    }

    public async getTeamsOfCurrentUserWithMemberCount(): Promise<Team[]> {
        const userId = this.authenticationContext.userId;

        if(userId === undefined) {
            throw Error("getTeamsByUserIdWithCountOfMembers: Authentication error");
        }

        const teamMemberResp = await this.getTeamsIdWhereUserIsMemberyUserId(userId);

        const teamMemberIds = teamMemberResp._embedded.teamMembers;

        const teams: Team[] = [];

        for (const teamMember of teamMemberIds) {
            const team = await this.getTeamByTeamMemberId(teamMember.id);
            const teamMembers = await this.getTeamMembers(team.id);
            const memberCount = this.countTeamMembers(teamMembers);
            team.memberCount = memberCount;

            const teamInfo = await this.getTeamById(team.id);
            team.id = teamInfo.id;
            team.name = teamInfo.name;
            team.state = teamInfo.state;
            team._links = teamInfo._links;

            teams.push(team);
        }
        return teams;
    }

    
    public async createTeam(team: Team): Promise<Team> {
        const teamLead = this.getPath() + '/users/' + team.team_lead_id;
        const name = team.name;
        const state = team.state;
        return this.fetchJson<Team>('/teams', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({teamLead, name, state})
        });
    }
    

    public async getTeams(): Promise<Team[]> {
        const resp = this.fetchJson<TeamResponse>('/teams', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return (await resp)._embedded.teams;
    }

    public async getTeamsWithMemberCount(): Promise<Team[]> {
        const resp = this.fetchJson<TeamResponse>('/teams', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        let teams = (await resp)._embedded.teams;

        for (const team of teams) {
            const teamMembers = await this.getTeamMembers(team.id);
            const memberCount = this.countTeamMembers(teamMembers);
            team.memberCount = memberCount;
        }

        return (await resp)._embedded.teams;
    }

    public async addMemberToTeam(teamId?: number, memberId?: number): Promise<TeamMember> {
        const team = this.getPath() + /teams/ + teamId?.toString();
        const user = this.getPath() + /users/ + memberId?.toString();

        const responseData = this.fetchJson<TeamMember>('/teamMembers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({team, user})
        });

        return await responseData;
    }

    public async removeMemberFromTeam(memberId: number): Promise<TeamMember> {
        // удаляем командные роли
        const teamMemberRoles = await this.getTeamMemberRolesByTeamMemId(memberId);
        for (const teamMemberRole of teamMemberRoles) {
            this.deleteTeamMemberRoleById(teamMemberRole.id);
        }

        // удаление записей из assigned_tasks
        const assignedTaskGetResp = await this.fetchJson<AssignedTasksResponse>(`/assignedTasks?teamMemberId=` + memberId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const assignedTasks = assignedTaskGetResp._embedded.assignedTasks;
        console.log(assignedTasks);
        for (const assignedTask of assignedTasks) {
            await this.fetchJson<AssignedTasksResponse>(`/assignedTasks/` + assignedTask.id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        }

        const responseData = this.fetchJson<TeamMember>('/teamMembers/' + memberId.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        return await responseData; // Проблема с удалением
    }

    public async getTeamMemberRolesByTeamMemId(teamMemberId: number): Promise<TeamMemberRole[]> {
        // получаем записи из таблицы team member roles
        const resp = await this.fetchJson<TeamMemberRolesResponse>(`/teamMemberRoles?teamMemberId=` + teamMemberId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const teamMemberRoles = resp._embedded.teamMemberRoles;
        return teamMemberRoles;
    }

    public async deleteTeamMemberRoleById(teamMemberRoleId: number): Promise<TeamMemberRole> {
        const resp = await this.fetchJson<TeamMemberRole>(`/teamMemberRoles/` + teamMemberRoleId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return resp;
    }




    public async updateTeamName(teamId: number, newName: string): Promise<void> {
        const response = this.fetchJson<void>('/teams/' + teamId.toString(), {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        });

        if (!response) {
            throw new Error('Failed to update team name');
        }
    }
}
