import { UserApi } from "./UserApi";
import { AuthenticationContextData } from "../lib/authentication";
import { BaseApi } from "./BaseApi";
import ApiContext from "../../features/api-context";
import { DeadlineResponse, SprintTask, SprintTasksResponse, Task, TeamMember, UserResponse, UserInfoResponse, AssignedTasksResponse } from "./IResponses";
import { format, parse, parseISO } from 'date-fns';

export class SprintTaskApi extends BaseApi {
    
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    public async assignTasks(sprintId: number) : Promise<AssignedTasksResponse[]> {
        const href = this.getPath() + '/sprints/' + sprintId.toString();

        const assignedTasks = await this.fetchJson<AssignedTasksResponse[]>(`/assign`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({href})
        });

        return assignedTasks;
    }

    public async getSprintTasksWithAllInfoBySprintId(sprintId: number): Promise<SprintTask[]> {
        const sprintTasks = await this.getSprintTasksBySprintId(sprintId); // id и sp

        for (let sprintTask of sprintTasks) {
            //http://localhost:8080/sprintTasks/1/task "id": 1, "priority": "A", "state": "TODO", "headline": "вапва", "description": "ваав",
            const task = await this.fetchJson<Task>(`/sprintTasks/`+sprintTask.id+`/task`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            sprintTask.task_id = task.id;
            sprintTask.priority = task.priority;
            sprintTask.state = task.state;
            sprintTask.headline = task.headline;
            sprintTask.description = task.description;

            // deadline_id, deadline_time, deadline_type
            const deadlineResp = await this.fetchJson<DeadlineResponse>(`/tasks/` + task.id + `/deadline`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            sprintTask.deadline_id = deadlineResp.id;
            sprintTask.deadline_time = deadlineResp.time;
            sprintTask.deadline_type = deadlineResp.type;

            //team_member_id, team_member_fullName
            //http://localhost:8080/assignedTasks?taskId=1 получаем assignedTasks_id
            const assignedTaskResp = await this.fetchJson<AssignedTasksResponse>(`/assignedTasks?taskId=`+task.id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });


            if (assignedTaskResp._embedded.assignedTasks.length > 0)
            {
                //http://localhost:8080/assignedTasks/1/teamMember получаем team member
                const teamMemberResp = await this.fetchJson<TeamMember>(`/assignedTasks/` + assignedTaskResp._embedded.assignedTasks[0].id + `/teamMember`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                sprintTask.team_member_id = teamMemberResp.id;

                //http://localhost:8080/teamMembers/1/user получаем id ответственного пользователя
                const userResp = await this.fetchJson<UserResponse>(`/teamMembers/`+teamMemberResp.id+`/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                //http://localhost:8080/userInfoes?user.Id=1 получаем информацию об ответственном пользователе
                const userInfoResp = await this.fetchJson<UserInfoResponse>(`/userInfoes?user.Id=`+userResp.id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                sprintTask.team_member_fullName = userInfoResp._embedded.userInfoes[0].fullName;

                console.log(sprintTask.team_member_fullName);
            }
        }

        return sprintTasks;
    }



    
    public async getSprintTasksBySprintId(sprintId: number): Promise<SprintTask[]> {
        const resp = this.fetchJson<SprintTasksResponse>(`/sprintTasks?sprintId=`+sprintId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return (await resp)._embedded.sprintTasks;
    }


}