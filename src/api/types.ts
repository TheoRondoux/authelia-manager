export type AutheliaUser = {
    username: string;
    displayname: string;
    email: string;
    groups: string[];
};

export type CreateUserInput = {
    username: string;
    password: string;
    displayname: string;
    email: string;
    groups: string[];
};

export type UpdateUserInput = {
    password?: string;
    displayname?: string;
    email?: string;
    groups?: string[];
};

export type AccessRule = {
    domain: string;
    policy: string;
    subject?: string[];
};

export type CreateAccessRuleInput = {
    domain: string;
    policy: string;
    subject?: string[];
};

export type AutheliaConfig = {
    default_policy: string;
    rules: AccessRule[];
};