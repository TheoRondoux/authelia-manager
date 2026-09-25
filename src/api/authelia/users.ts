import type {AutheliaUser, CreateUserInput, UpdateUserInput} from "../types.ts";
import {request} from "./authelia.ts";

export function getUsers(): Promise<AutheliaUser[]> {
    return request("/users");
}

export function getUser(username: string): Promise<AutheliaUser> {
    return request(`/users/${encodeURIComponent(username)}`);
}

export function createUser(
    user: CreateUserInput
): Promise<AutheliaUser> {
    return request("/users", {
        method: "POST",
        body: JSON.stringify(user),
    });
}

export function updateUser(
    username: string,
    user: UpdateUserInput
): Promise<AutheliaUser> {
    return request(`/users/${encodeURIComponent(username)}`, {
        method: "PUT",
        body: JSON.stringify(user),
    });
}

export function deleteUser(username: string): Promise<void> {
    return request(`/users/${encodeURIComponent(username)}`, {
        method: "DELETE",
    });
}