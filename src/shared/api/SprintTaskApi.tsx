import { UserApi } from "./UserApi";
import { AuthenticationContextData } from "../lib/authentication";
import { BaseApi } from "./BaseApi";
import ApiContext from "../../features/api-context";
import { DeadlineResponse, SprintTask, SprintTasksResponse, Task } from "./IResponses";
import { format, parse, parseISO } from 'date-fns';

export class SprintTaskApi extends BaseApi {
    
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
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