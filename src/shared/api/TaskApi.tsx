import {AuthenticationContextData} from "../lib/authentication";
import {BaseApi} from "./BaseApi";
import {DeadlineResponse, Task, TasksResponse} from "./IResponses";

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
        return this.fetchJson<DeadlineResponse>(`/tasks/`+taskId+`/deadline`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTaskDeadline(task: Task) {
        return this.fetchJson<DeadlineResponse>(task._links.deadline.href, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async getTasksForBacklog(): Promise<Task[]> {
        const tasks = await this.getTasks();

        await Promise.all(tasks.map(async (task) => {
            task.deadline = await this.getTaskDeadline(task);
            return task;
        }));

        return tasks;
    }
}