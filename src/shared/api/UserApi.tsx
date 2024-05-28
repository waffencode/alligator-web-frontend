import {BaseApi} from "./BaseApi";
import {AuthResponse, UserInfoResponse, UserProfile, whoamiResponse, UserInfoWithRolesInterfaces, RolesResponse, UserRole, UserRolesResponse, Role} from "./IResponses";
import {getAuthenticationContextData, AuthenticationContextData} from "../lib/authentication";

export class UserApi extends BaseApi {
    private authenticationContext: AuthenticationContextData

    constructor(authenticationContext: AuthenticationContextData) {
        super();
        this.authenticationContext = authenticationContext;
    }

    public async getUserInfoesByUserId(userId: number): Promise<UserProfile> {
        return this.fetchJson<UserProfile>(`/userInfoes/search/getByUserId?userId=`+userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // получение информации обо всех пользователях
    public async getAllUsersInfoWithRoles(): Promise<UserInfoWithRolesInterfaces[]> {
        // получаем инфу о пользователе без ролей (id, fullName, email, phone_number, _links)
        const usersResp = this.userInfoes();
        const users = (await usersResp)._embedded.userInfoes;

        // хотим добавить роли в виде массива интерфейсов Role
        let usersWithRoles: UserInfoWithRolesInterfaces[] = [];

        // проходимся чтобы воспользоваться id пользователя и добавить каждому роли
        for (const user of users) {
            // массив user_roles id
            const userRoles = await this.getUserRolesByUserInfoId(user.id); // from таблица user_roles
            // для каждой записи из таблицы user_roles находим настоящее имя роли
            let userRoleWithName: Role[] = [];
            for (const userRole of userRoles) {
                let role = await this.getRoleByUserRolesId(userRole.id);
                role.role_id = role.id; // id роли сохраняем в другое поле
                role.id = userRole.id; // id сохраняем как в user_roles, чтобы можно было удалить запись при необходимости
                userRoleWithName.push(role); // добавляем в массив
            }
            
            let userWithRoles: UserInfoWithRolesInterfaces = {
                ...user,
                roles: userRoleWithName
            };            
            usersWithRoles.push(userWithRoles);
        }

        return usersWithRoles;
    }

    // получение user ролей
    public async getUserRolesByUserInfoId(userId: number): Promise<UserRole[]> {
        const rolesResp = await this.fetchJson<UserRolesResponse>(`/userRoles/search/findAllByUser?user=http://localhost:8080/users/`+userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return rolesResp._embedded.userRoles;
    }

    // получение роли по user_roles id
    public async getRoleByUserRolesId(userRoleId: number): Promise<Role> {
        const rolesResp = await this.fetchJson<Role>(`/userRoles/`+userRoleId+`/role`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return rolesResp;
    }
    

    public async whoami(): Promise<whoamiResponse> {
        return this.fetchJson<whoamiResponse>(`/whoami`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async userInfoes(): Promise<UserInfoResponse> { 
        return this.fetchJson<UserInfoResponse>(`/userInfoes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // changePassword
    public async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
        return this.fetchJson<AuthResponse>(`/changePassword`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword})
        });
    }

    public async getRoles(): Promise<Role[]> {
        const resp = await this.fetchJson<RolesResponse>(`/roles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return resp._embedded.roles;

    }
}