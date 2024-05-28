import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Sprint, SprintsResponse, Team, TeamMember, TeamResponse, UserInfo, UserInfoResponse} from "./IResponses";

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

    public async getSprints(): Promise<Sprint[]> {
        const sprintsResp = await this.fetchJson<SprintsResponse>(`/sprints`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const sprints = sprintsResp._embedded.sprints;
        for (const sprint of sprints) {
            // team 
            const team = await this.getTeamBySprintId(sprint.id);
            sprint.team_id = team.id;
            sprint.team_name = team.name;
            // scrumMaster
            //GET /sprints/1/scrumMaster
            const teamMember = await this.getTeamMemberBySprintId(sprint.id);
            //GET /teamMembers/1/user
            const user = await this.getUserByTeamMemberId(teamMember.id);
            //GET /userInfoes?user.Id=2
            const userInfo = await this.getUserInfoByUserId(user.id);
            sprint.scrumMaster_id = teamMember.id; // таблица team_members
            sprint.scrumMaster_fullName = userInfo.fullName;
        }
        return sprints;
    }

    public async getSprintBySprintId(sprintId: number): Promise<Sprint> {
        return this.fetchJson<Sprint>(`/sprints/`+sprintId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });;
    }

    public async getTeamBySprintId(sprintId: number): Promise<Team> {
        return this.fetchJson<Team>(`/sprints/`+sprintId+`/team`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTeamMemberBySprintId(sprintId: number): Promise<TeamMember> {
        return this.fetchJson<TeamMember>(`/sprints/`+sprintId+`/scrumMaster`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });;
    }

    public async getUserByTeamMemberId(teamMemberId: number): Promise<UserInfo> {
        const team = await this.fetchJson<UserInfo>(`/teamMembers/`+teamMemberId+`/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return team;
    }

    public async getUserInfoByUserId(userId: number): Promise<UserInfo> {
        const userInfoResp = await this.fetchJson<UserInfoResponse>(`/userInfoes?user.Id=`+userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return userInfoResp._embedded.userInfoes[0];
    }

    public async updateSprint(sprint: Sprint): Promise<Sprint> {
        const startTime = sprint.startTime;
        const endTime = sprint.endTime;
        const sp = sprint.sp;
        const name = sprint.name;
        const state = sprint.state;
        const id = sprint.id;

        // установка новой команды
        //const team = this.getPath()+'/teams/'+sprint.team_id;
        
        // установка нового scrum master (из членов команды)
        const scrumMaster = this.getPath()+'/teamMembers/'+sprint.scrumMaster_id;

        const sprintsResp = await this.fetchJson<Sprint>(`/sprints/`+sprint.id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, startTime, endTime, sp, name, state, scrumMaster})
        });

        const sprints = sprintsResp;
        
        return sprints;
    }

    public async createSprint(sprint: Sprint): Promise<Sprint> {
        const startTime = sprint.startTime;
        const endTime = sprint.endTime;
        const sp = sprint.sp;
        const name = sprint.name;
        const state = sprint.state;
        const id = sprint.id;

        // установка команды
        const team = this.getPath()+'/teams/'+sprint.team_id;
        
        // установка scrum master (из членов команды)
        const scrumMaster = this.getPath()+'/teamMembers/'+sprint.scrumMaster_id;

        const sprintsResp = await this.fetchJson<Sprint>(`/sprints`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, startTime, endTime, sp, name, state, team, scrumMaster})
        });

        const sprints = sprintsResp;
        
        return sprints;
    }
    


}