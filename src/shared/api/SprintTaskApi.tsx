import { UserApi } from "./UserApi";
import { AuthenticationContextData } from "../lib/authentication";
import { BaseApi } from "./BaseApi";
import { DeadlineResponse, Task, TasksResponse } from "./IResponses";
import { format, parse, parseISO } from 'date-fns';

export class SprintTaskApi extends BaseApi {
    private authenticationContext: AuthenticationContextData;

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }


}