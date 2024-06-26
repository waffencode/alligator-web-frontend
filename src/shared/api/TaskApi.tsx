import { AuthenticationContextData } from "../lib/authentication";
import { BaseApi } from "./BaseApi";
import { AssignedTasksResponse, DeadlineResponse, SprintTask, SprintTaskRole, SprintTaskRolesResponse, SprintTasksResponse, Task, TasksResponse } from "./IResponses";
import { format, parseISO } from 'date-fns';

export class TaskApi extends BaseApi {
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    // Получение задач из backlog
    public async getTasks(): Promise<Task[]> {
        const resp = this.fetchJson<TasksResponse>(`/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return (await resp)._embedded.tasks;
    }

    // добавление дедлайна
    public async getTaskDeadlineByTaskId(taskId: number): Promise<DeadlineResponse> {
        return this.fetchJson<DeadlineResponse>(`/tasks/` + taskId + `/deadline`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTasksForBacklog(): Promise<Task[]> {
        const tasks = await this.getTasks();

        for (const task of tasks) {
            const deadlineResp = await this.getTaskDeadlineByTaskId(task.id);
            task.deadline_id = deadlineResp.id;
            task.deadline_time = deadlineResp.time;
            task.deadline_type = deadlineResp.type;
        }
        return tasks;
    }

    public async updateTask(task: Task): Promise<TasksResponse> {
        // обновляем дедлайн (при условии, что на 1 задачу - 1 дедлайн)
        let newDeadline: DeadlineResponse;
        let resp: Promise<TasksResponse>;

        const id = task.id;
        const description = task.description;
        const headline = task.headline;
        const priority = task.priority;
        const state = task.state;

        if (task.deadline_id && task.deadline_time && task.deadline_type) {
            newDeadline = await this.updateDeadline(task.deadline_id, task.deadline_time, task.deadline_type);
            const deadline = this.getPath() + "/deadlines/" + newDeadline.id;
            resp = this.fetchJson<TasksResponse>(`/tasks?id=` + task.id, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ deadline, id, description, headline, priority, state })
            });
        } else {
            resp = this.fetchJson<TasksResponse>(`/tasks?id=` + task.id, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, description, headline, priority, state })
            });
        }

        return resp;
    }

    // обновление дедлайна
    public async updateDeadline(id: number, timeNotFormatted: string, type: string): Promise<DeadlineResponse> {

        const dateObject = parseISO(timeNotFormatted);
        const time = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSSX");

        return this.fetchJson<DeadlineResponse>(`/deadlines?id=` + id, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, time, type })
        });;
    }

    // создание задачи
    public async createTask(task: Task): Promise<Task> {
        // обновляем дедлайн (при условии, что на 1 задачу - 1 дедлайн)
        let newDeadline: DeadlineResponse;
        let resp: Promise<Task>;

        const description = task.description;
        const headline = task.headline;
        const priority = task.priority;
        const state = task.state;

        if (task.deadline_time && task.deadline_type) {
            newDeadline = await this.createDeadline(task.deadline_time, task.deadline_type);
            const deadline = this.getPath() + "/deadlines/" + newDeadline.id;
            resp = this.fetchJson<Task>(`/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ deadline, description, headline, priority, state })
            });
        } else {
            resp = this.fetchJson<Task>(`/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description, headline, priority, state })
            });
        }

        return resp;
    }

    // создание дедлайна
    public async createDeadline(timeNotFormatted: string, type: string): Promise<DeadlineResponse> {

        const dateObject = parseISO(timeNotFormatted);
        const time = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSSX");

        return this.fetchJson<DeadlineResponse>(`/deadlines`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ time, type })
        });
    }

    // удаление задачи
    public async deleteTask(taskId: number): Promise<Task> {
        // не удаляем дедлайн
        //let newDeadline: DeadlineResponse;

        // получаем sprint task id
        const sprintTaskResp = await this.fetchJson<SprintTasksResponse>(`/sprintTasks?taskId=` + taskId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (sprintTaskResp.page.totalElements > 0) {
            const sprintTaskId = sprintTaskResp._embedded.sprintTasks[0].id;
  
            // удаление назначенной задачи
            const assignedTaskGetResp = await this.getAssignedTaskBySprintTaskId(sprintTaskId);
            if (assignedTaskGetResp.page.totalElements != 0) {
                const assignedTaskDelResp = await this.deleteAssignedTaskById(assignedTaskGetResp._embedded.assignedTasks[0].id);
            }
    
            // удаление командных ролей у задачи
            const sprintTaskRolesResp = await this.fetchJson<SprintTaskRolesResponse>(`/sprintTaskRoles?taskId=` + sprintTaskId, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            for (const sprintTaskRole of sprintTaskRolesResp._embedded.sprintTaskRoles) {
                await this.fetchJson<SprintTaskRole>(`/sprintTaskRoles/` + sprintTaskRole.id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
    
            // удаление sprint task
            const sprintTaskDelResp = await this.fetchJson<SprintTask>(`/sprintTasks/` + sprintTaskId, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        
        return this.fetchJson<Task>(`/tasks/`+taskId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
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
}