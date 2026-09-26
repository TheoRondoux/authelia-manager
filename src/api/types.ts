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

export type OidcClient = {
    client_id: string;
    client_name: string;
    client_secret?: string;
    public: boolean;
    authorization_policy: string;
    require_pkce: boolean;
    pkce_challenge_method?: string;
    redirect_uris: string[];
    scopes: string[];
    response_types: string[];
    grant_types: string[];
    access_token_signed_response_alg?: string;
    userinfo_signed_response_alg?: string;
    token_endpoint_auth_method?: string;
};