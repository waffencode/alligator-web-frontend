import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Team, TeamMembersResponse, TeamMembersResponse_TeamMember} from "./IResponses";

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

    
    public async createTeam(team: { name: string }): Promise<void> {
        return this.fetchJson<void>('/teams', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(team)
        });
    }
}
