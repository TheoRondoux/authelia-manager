import {request} from "./authelia.ts";

export function getGroups(): Promise<string[]> {
    return request("/groups");
}

export function createGroup(name: string): Promise<string[]> {
    return request("/groups", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}

export function deleteGroup(name: string): Promise<string[]> {
    return request(`/groups/${encodeURIComponent(name)}`, {
        method: "DELETE",
    });
}