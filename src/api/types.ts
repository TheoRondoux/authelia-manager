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

export type WebAuthnConfig = {
    disable?: boolean;
    enable_passkey_login?: boolean;
    display_name?: string;
    attestation_conveyance_preference?: string;
    timeout?: string;

    selection_criteria?: {
        attachment?: string;
        discoverability?: string;
        user_verification?: string;
    };

    filtering?: {
        permitted_aaguids?: string[];
        prohibited_aaguids?: string[];
        prohibit_backup_eligibility?: boolean;
    };

    metadata?: {
        enabled?: boolean;
        cache_policy?: string;
        validate_trust_anchor?: boolean;
        validate_entry?: boolean;
        validate_entry_permit_zero_aaguid?: boolean;
        validate_status?: boolean;
    };
};