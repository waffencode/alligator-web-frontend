import {BaseApi} from "./BaseApi";
import {AuthenticationContextData} from "../lib/authentication";
import {Team, 
    TeamRole, 
    TeamRolesResponse, 
    TeamMemberRole,
    TeamMemberRolesResponse,
    SprintTaskRolesResponse,
    SprintTaskRole, 
    TeamMember,
    UserResponse,
    UserInfo
} from "./IResponses";
import User from "../../entities/User";

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
        // удалить роль у пользователей team_member_roles
        const teamMemberRoleGetResp = await this.fetchJson<TeamMemberRolesResponse>(`/teamMemberRoles?teamRoleId=`+teamRole.id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const teamMemberRoles = teamMemberRoleGetResp._embedded.teamMemberRoles;
        for (const teamMemberRole of teamMemberRoles) {
            await this.deleteTeamMemberRoleById(teamMemberRole.id);
        }

        // удалить роль у задач sprint_task_roles
        const sprintTaskRolesGetResp = await this.fetchJson<SprintTaskRolesResponse>(`/sprintTaskRoles?teamRoleId=` + teamRole.id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const sprintTaskRoles = sprintTaskRolesGetResp._embedded.sprintTaskRoles;
        for (const sprintTaskRole of sprintTaskRoles) {
            await this.deleteSprintTaskRoleById(sprintTaskRole.id);
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

    // получаем массив ролей, имеющихся у пользователя
    public async getTeamRolesByTeamMemId(teamMemberId: number): Promise<TeamRole[]> {
        // получаем записи из таблицы team member roles
        const resp = await this.fetchJson<TeamMemberRolesResponse>(`/teamMemberRoles?teamMemberId=` + teamMemberId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const teamMemberRoles = resp._embedded.teamMemberRoles;
        let teamRoles: TeamRole[] = [];
        for (const teamMemberRole of teamMemberRoles) {
            let teamRole = await this.getTeamRoleByTeamMemRoleId(teamMemberRole.id);
            teamRole.team_member_role_id = teamMemberRole.id;
            teamRoles.push(teamRole);
        }
        return teamRoles;
    }

    public async getTeamRoleByTeamMemRoleId(teamMemberRoleId: number): Promise<TeamRole> {
        const resp = await this.fetchJson<TeamRole>(`/teamMemberRoles/` + teamMemberRoleId + `/role`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return resp;
    }

    public async getTeamMember(teamMemberId: number): Promise<TeamMember> {
        // получаем id пользователя
        const userDetailsResp = await this.fetchJson<UserResponse>(`/teamMembers/` + teamMemberId + `/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // получаем имя пользователя
        const userInfoResp = await this.fetchJson<UserInfo>(`/userInfoes/` + userDetailsResp.id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // получаем team member
        const teamMemberResp = await this.fetchJson<TeamMember>(`/teamMembers/` + teamMemberId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        teamMemberResp.fullName = userInfoResp.fullName;
        return teamMemberResp;
    }

    public async updateTeamMemberRoles(teamMemberId: number, newTeamRoles: TeamRole[]): Promise<TeamRole[]> {
        const oldTeamRoles = await this.getTeamRolesByTeamMemId(teamMemberId);
        // удаляем роли, которых нет в newTeamRoles
        // Получаем массив идентификаторов ролей из newTeamRoles
        const newRoleIds = newTeamRoles.map(role => role.id);
        // Фильтруем oldTeamRoles и оставляем только те роли, у которых id отсутствует в newRoleIds
        const rolesToRemove = oldTeamRoles.filter(role => !newRoleIds.includes(role.id));
        for (const teamRole of rolesToRemove) {
            if (teamRole.team_member_role_id) await this.deleteTeamMemberRoleById(teamRole.team_member_role_id);
        }
        
        // добавляем роли, которых нет в teamMemberId
        // Получаем массив идентификаторов ролей из oldTeamRoles
        const oldRoleIds = oldTeamRoles.map(role => role.id);
        // Фильтруем newTeamRoles и оставляем только те роли, у которых id отсутствует в oldRoleIds
        const rolesToAdd = newTeamRoles.filter(role => !oldRoleIds.includes(role.id));
        for (const teamRole of rolesToAdd) {
            await this.addTeamMemberRole(teamMemberId, teamRole.id);
        }
        return await this.getTeamRolesByTeamMemId(teamMemberId);
    }

    public async addTeamMemberRole(teamMemberRoleId: number, teamRoleId: number): Promise<TeamMemberRole> {
        const teamMember = this.getPath() + `/teamMembers/` + teamMemberRoleId;
        const role = this.getPath() + `/teamRoles/` + teamRoleId;
        const deleteTeamMemberRole = await this.fetchJson<TeamMemberRole>(`/teamMemberRoles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teamMember, role })
        });
        return deleteTeamMemberRole;
    }

    // sprint task roles
    public async updateSprintTaskRoles(sprintTaskId: number, oldTeamRoles: TeamRole[], newTeamRoles: TeamRole[]): Promise<TeamRole[]> {
        // удаляем роли, которых нет в newTeamRoles
        // Получаем массив идентификаторов ролей из newTeamRoles
        const newRoleIds = newTeamRoles.map(role => role.id);
        // Фильтруем oldTeamRoles и оставляем только те роли, у которых id отсутствует в newRoleIds
        const rolesToRemove = oldTeamRoles.filter(role => !newRoleIds.includes(role.id));
        for (const teamRole of rolesToRemove) {
            if (teamRole.sprint_task_role_id) await this.deleteSprintTaskRoleBySprintTaskRoleId(teamRole.sprint_task_role_id);
        }
        
        // добавляем роли, которых нет в sprint task roles
        // Получаем массив идентификаторов ролей из oldTeamRoles
        const oldRoleIds = oldTeamRoles.map(role => role.id);
        // Фильтруем newTeamRoles и оставляем только те роли, у которых id отсутствует в oldRoleIds
        const rolesToAdd = newTeamRoles.filter(role => !oldRoleIds.includes(role.id));
        for (const teamRole of rolesToAdd) {
            await this.addSprintTaskRole(sprintTaskId, teamRole.id);
        }
        return await this.getTeamRoles();
    }

    public async getTeamRoleBySprintTaskRoleId(sprintTaskId: number): Promise<TeamRole> {
        const arrresp = await this.fetchJson<TeamRolesResponse>(`/sprintTaskRoles?id=` + sprintTaskId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
   
        return arrresp._embedded.teamRoles[0];    
    }

    public async deleteSprintTaskRoleBySprintTaskRoleId(sprintTaskRoleId: number): Promise<SprintTaskRole> {
        const deleteSprintTaskRole = await this.fetchJson<SprintTaskRole>(`/sprintTaskRoles/` + sprintTaskRoleId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return deleteSprintTaskRole;
    }

    public async addSprintTaskRole(sprintTaskRoleId: number, teamRoleId: number): Promise<TeamMemberRole> {
        const task = this.getPath() + `/sprintTasks/` + sprintTaskRoleId;
        const role = this.getPath() + `/teamRoles/` + teamRoleId;
        const deleteTeamMemberRole = await this.fetchJson<TeamMemberRole>(`/sprintTaskRoles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, role })
        });
        return deleteTeamMemberRole;
    }
   
}
