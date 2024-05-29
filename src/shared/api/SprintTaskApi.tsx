import { AuthenticationContextData } from "../lib/authentication";
import { BaseApi } from "./BaseApi";
import {
    AssignedTasksResponse,
    DeadlineResponse,
    SprintTask, SprintTaskDto,
    SprintTasksResponse,
    Task,
    TasksResponse,
    TeamMember,
    UserInfoResponse,
    UserResponse
} from "./IResponses";
import { TaskApi } from "./TaskApi";
import { format } from 'date-fns';

export class SprintTaskApi extends BaseApi {
    private taskApi: TaskApi;
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData, taskApi: TaskApi) {
        super();
        this.authenticationContext = authenticationContext;
        this.taskApi = taskApi;
    }

    public async assignTasks(sprintId: number): Promise<AssignedTasksResponse[]> {
        const href = this.getPath() + '/sprints/' + sprintId.toString();

        return await this.fetchJson<AssignedTasksResponse[]>(`/assign`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ href })
        });
    }

    public async addSprintTask(sprintTaskDto: SprintTaskDto): Promise<SprintTask> {
        const sp = sprintTaskDto.sp;
        const task = this.getPath() + '/tasks/' + sprintTaskDto.task_id.toString();
        const sprint = this.getPath() + '/sprints/' + sprintTaskDto.sprint_id;

        return await this.fetchJson<SprintTask>(`/sprintTasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sp, task, sprint })
        });
    }

    public async getSprintTasksWithAllInfoBySprintId(sprintId: number): Promise<SprintTask[]> {
        const sprintTasks = await this.getSprintTasksBySprintId(sprintId); // id и sp

        for (let sprintTask of sprintTasks) {
            //http://localhost:8080/sprintTasks/1/task "id": 1, "priority": "A", "state": "TODO", "headline": "вапва", "description": "ваав",
            const task = await this.fetchJson<Task>(`/sprintTasks/` + sprintTask.id + `/task`, {
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
            const assignedTaskResp = await this.fetchJson<AssignedTasksResponse>(`/assignedTasks?task.id=` + sprintTask.id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (assignedTaskResp._embedded.assignedTasks.length > 0) {
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
                const userResp = await this.fetchJson<UserResponse>(`/teamMembers/` + teamMemberResp.id + `/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                //http://localhost:8080/userInfoes?user.Id=1 получаем информацию об ответственном пользователе
                const userInfoResp = await this.fetchJson<UserInfoResponse>(`/userInfoes?user.Id=` + userResp.id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                sprintTask.team_member_fullName = userInfoResp._embedded.userInfoes[0].fullName;
            }
        }

        return sprintTasks;
    }


    public async updateSprintTask(sprintTask: SprintTask): Promise<SprintTask> {
        // статус
        // получение id задачи
        const taskResp = await this.getTaskBySprintTaskId(sprintTask.id);
        // изменение статуса
        const state = sprintTask.state;
        const taskPatchResp = this.fetchJson<TasksResponse>(`/tasks/` + taskResp.id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state })
        });

        // TODO: ручное назначение задачи
        // находим, назначена ли задача
        const assignedTaskGetResp = await this.getAssignedTaskBySprintTaskId(sprintTask.id);
        if (assignedTaskGetResp.page.totalElements != 0) {
            if (sprintTask.team_member_id && sprintTask.team_member_id > 0) {
                // если да, то меняем id team member (пользователя)
                const teamMemberId = sprintTask.team_member_id;
                const updateAssResp = await this.fetchJson<AssignedTasksResponse>(`/assignedTasks/` + assignedTaskGetResp._embedded.assignedTasks[0].id, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ teamMemberId })
                });
            } else {
                // удаляем назначение
                const assignedTaskDelResp = await this.deleteAssignedTaskById(assignedTaskGetResp._embedded.assignedTasks[0].id);
            }
        } else {
            if (sprintTask.team_member_id && sprintTask.team_member_id > 0) {
                // если нет, то добавляем запись в таблицу
                const teamMember = this.getPath() + "/teamMembers/" + sprintTask.team_member_id;
                const task = this.getPath() + "/sprintTasks/" + sprintTask.id;
                const assignationTime = new Date(new Date().getTime()).toISOString();

                const postAssResp = await this.fetchJson<AssignedTasksResponse>(`/assignedTasks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ assignationTime, task, teamMember })
                });
                console.log(postAssResp);
            }
        }

        // SP
        const sp = sprintTask.sp;
        const updateSPResp = await this.fetchJson<SprintTask>(`/sprintTasks/` + sprintTask.id, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sp })
        });

        return updateSPResp
    }

    public async getTaskBySprintTaskId(sprintTaskId: number): Promise<Task> {
        const resp = await this.fetchJson<Task>(`/sprintTasks/` + sprintTaskId + `/task`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return resp;
    }


    public async deleteSprintTaskById(sprintTaskId: number): Promise<SprintTask> {
        // удаление назначенной задачи
        const assignedTaskGetResp = await this.getAssignedTaskBySprintTaskId(sprintTaskId);
        if (assignedTaskGetResp.page.totalElements != 0) {
            const assignedTaskDelResp = await this.deleteAssignedTaskById(assignedTaskGetResp._embedded.assignedTasks[0].id);
        }
        const sprintTaskResp = await this.fetchJson<SprintTask>(`/sprintTasks/` + sprintTaskId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return sprintTaskResp;
    }

    public async deleteAssignedTaskById(assignedTaskId: number): Promise<AssignedTasksResponse> {
        const assignedTaskDelResp = await this.fetchJson<AssignedTasksResponse>(`/assignedTasks/` + assignedTaskId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return assignedTaskDelResp;
    }

    public async getSprintTasksBySprintId(sprintId: number): Promise<SprintTask[]> {
        const resp = this.fetchJson<SprintTasksResponse>(`/sprintTasks?sprintId=` + sprintId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return (await resp)._embedded.sprintTasks;
    }

    public async getAssignedTaskBySprintTaskId(sprintTaskId: number): Promise<AssignedTasksResponse> {
        return this.fetchJson<AssignedTasksResponse>(`/assignedTasks?taskId=` + sprintTaskId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Get tasks available for adding to the sprint.
     */
    public async getProposedTasks(): Promise<Task[]> {
        const tasks = await this.taskApi.getTasks();
        const filteredTasks: Task[] = [];

        for (let task of tasks) {
            const sprintTaskResp = await this.fetchJson<SprintTasksResponse>(`/sprintTasks?taskId=` + task.id.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (sprintTaskResp.page.totalElements === 0) {
                filteredTasks.push(task);
            }
        }

        return filteredTasks;
    }
}