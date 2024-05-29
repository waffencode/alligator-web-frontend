const roleTranslations: { [key: string]: string } = {
    PROJECT_MANAGER: 'Менеджер проекта',
    BUSINESS_ANALYTIC: 'Бизнес-аналитик',
    USER: 'Пользователь',
};

const translateRole = (role: string): string => roleTranslations[role] ??  role;

const rolesTranslator = (roles: string[] | undefined): string => {
    if (!roles) return '';
    return roles.map(role => roleTranslations[role] || role).join(', ');
};

export {rolesTranslator, translateRole};