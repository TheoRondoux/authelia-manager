import {
    readYaml,
    writeYaml,
    CONFIGURATION_FILE,
    USERS_FILE,
} from "./yaml.js";

import { hashPassword } from "./password.js";
import {execFile} from "node:child_process";
import {promisify} from "node:util";

type RawUser = {
    password: string;
    displayname: string;
    email: string;
    groups: string[];
};

type UsersDatabase = {
    users: Record<string, RawUser>;
};

type Configuration = {
    access_control?: {
        default_policy?: string;
        rules?: AccessRule[];
    };
};

export type AccessRule = {
    domain: string;
    policy: string;
    subject?: string[];
};

export async function readUsers() {
    return readYaml<UsersDatabase>(USERS_FILE);
}

export async function readConfiguration() {
    return readYaml<Configuration>(CONFIGURATION_FILE);
}

/* -------------------------------------------------------------------------- */
/* USERS                                                                       */
/* -------------------------------------------------------------------------- */

export async function getUsers() {
    const database = await readUsers();

    return Object.entries(database.users ?? {}).map(
        ([username, user]) => ({
            username,
            displayname: user.displayname,
            email: user.email,
            groups: user.groups ?? [],
        })
    );
}

export async function getUser(username: string) {
    const database = await readUsers();

    const user = database.users?.[username];

    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    return {
        username,
        displayname: user.displayname,
        email: user.email,
        groups: user.groups ?? [],
    };
}

export async function createUser(
    username: string,
    user: {
        password: string;
        displayname: string;
        email: string;
        groups: string[];
    }
) {
    const database = await readUsers();

    if (database.users?.[username]) {
        throw new Error("Cet utilisateur existe déjà");
    }

    if (!username) {
        throw new Error("Le nom d'utilisateur est obligatoire");
    }

    const passwordHash = await hashPassword(user.password);

    database.users ??= {};

    database.users[username] = {
        password: passwordHash,
        displayname: user.displayname,
        email: user.email,
        groups: user.groups ?? [],
    };

    await writeYaml(USERS_FILE, database);

    return getUser(username);
}

export async function updateUser(
    username: string,
    data: {
        password?: string;
        displayname?: string;
        email?: string;
        groups?: string[];
    }
) {
    const database = await readUsers();

    if (!database.users?.[username]) {
        throw new Error("Utilisateur introuvable");
    }

    const currentUser = database.users[username];

    if (data.password !== undefined) {
        currentUser.password = await hashPassword(data.password);
    }

    if (data.displayname !== undefined) {
        currentUser.displayname = data.displayname;
    }

    if (data.email !== undefined) {
        currentUser.email = data.email;
    }

    if (data.groups !== undefined) {
        currentUser.groups = data.groups;
    }

    await writeYaml(USERS_FILE, database);

    return getUser(username);
}

export async function deleteUser(username: string) {
    const database = await readUsers();

    if (!database.users?.[username]) {
        throw new Error("Utilisateur introuvable");
    }

    delete database.users[username];

    await writeYaml(USERS_FILE, database);
}

/* -------------------------------------------------------------------------- */
/* GROUPS                                                                      */
/* -------------------------------------------------------------------------- */

export async function getGroups(): Promise<string[]> {
    const database = await readUsers();

    const groups = new Set<string>();

    for (const user of Object.values(database.users ?? {})) {
        for (const group of user.groups ?? []) {
            groups.add(group);
        }
    }

    return [...groups].sort();
}

export async function createGroup(name: string) {
    const database = await readUsers();

    const users = Object.values(database.users ?? {});

    // Un groupe n'est pas un objet indépendant dans users_database.yml.
    // On le crée donc en l'associant à aucun utilisateur pour le moment.
    // Authelia n'a pas besoin d'une déclaration globale du groupe.

    return getGroups();
}

export async function deleteGroup(name: string) {
    const database = await readUsers();

    for (const user of Object.values(database.users ?? {})) {
        user.groups = (user.groups ?? []).filter(
            (group) => group !== name
        );
    }

    await writeYaml(USERS_FILE, database);

    return getGroups();
}

/* -------------------------------------------------------------------------- */
/* RULES                                                                       */
/* -------------------------------------------------------------------------- */

export async function getAccessRules() {
    const config = await readConfiguration();

    return config.access_control?.rules ?? [];
}

export async function createAccessRule(rule: AccessRule) {
    const config = await readConfiguration();

    config.access_control ??= {};
    config.access_control.rules ??= [];

    config.access_control.rules.push(rule);

    await writeYaml(CONFIGURATION_FILE, config);

    return rule;
}

export async function updateAccessRule(
    index: number,
    rule: AccessRule
) {
    const config = await readConfiguration();

    const rules = config.access_control?.rules ?? [];

    if (!rules[index]) {
        throw new Error("Règle introuvable");
    }

    rules[index] = rule;

    await writeYaml(CONFIGURATION_FILE, config);

    return rule;
}

export async function deleteAccessRule(index: number) {
    const config = await readConfiguration();

    const rules = config.access_control?.rules ?? [];

    if (!rules[index]) {
        throw new Error("Règle introuvable");
    }

    rules.splice(index, 1);

    await writeYaml(CONFIGURATION_FILE, config);
}

/* -------------------------------------------------------------------------- */
/* CONTAINER                                                                  */
/* -------------------------------------------------------------------------- */

const execFileAsync = promisify(execFile);

const AUTHELIA_CONTAINER = "authelia";

export async function reloadAuthelia() {
    await execFileAsync("docker", [
        "kill",
        "--signal=SIGHUP",
        AUTHELIA_CONTAINER,
    ]);

    return {
        success: true,
        message: "Authelia rechargé",
    };
}