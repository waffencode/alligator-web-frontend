import {BaseApi} from "./BaseApi";
import {AuthResponse, UserInfoResponse, UserProfile, whoamiResponse, UserInfoWithRolesInterfaces, RolesResponse, UserRole, UserRolesResponse, Role} from "./IResponses";
import {AuthenticationContextData} from "../lib/authentication";

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
        // получение истинного id пользователя (user_details)
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

    public async updateUser(user: UserInfoWithRolesInterfaces, oldRoles: Role[], newRoles: Role[]): Promise<UserProfile> {
        let roles = await this.getUserRolesByUserInfoId(user.id);
        // удаляем старые роли по id в таблице user_roles
        for (const role of roles) {
            // если в новых ролях нет старой роли
            if (!newRoles.some(newRole => newRole.id === role.id)) {
                await this.deleteUserRole(role.id);
            }
        }

        // добавляем новые роли в таблицу user_roles
        for (const newRole of newRoles) {
            // если в старых ролях нет новой роли
            if (!oldRoles.some(oldRole => oldRole.id === newRole.id)) {
                await this.addUserRole(newRole.id, user.id);
            }
        }

        return await this.getUserInfoesByUserId(user.id);
    }

    public async deleteUserRole(userRoleId: number): Promise<Role> {
        return this.fetchJson<Role>(`/userRoles/`+userRoleId, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
    }

    public async addUserRole(userRoleId: number, userId: number): Promise<Role> {
        const role = this.getPath()+"/roles/"+userRoleId;
        const user = this.getPath()+"/users/"+userId;
        return this.fetchJson<Role>(`/userRoles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authenticationContext.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user, role})
        });
    }
    

}