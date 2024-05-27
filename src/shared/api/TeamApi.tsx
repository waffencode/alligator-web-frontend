import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Team, TeamMembersResponse, TeamMembersResponse_TeamMember, TeamResponse, TeamMember} from "./IResponses";

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
        const responseData = this.fetchJson<TeamMember>('/teamMembers/' + memberId.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        return await responseData;
    }
}
