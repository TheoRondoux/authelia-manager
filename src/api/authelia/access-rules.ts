import {request} from "./authelia.ts";
import type {AccessRule, CreateAccessRuleInput} from "../types.ts";

export function getAccessRules(): Promise<AccessRule[]> {
    return request("/access-rules");
}

export function createAccessRule(
    rule: CreateAccessRuleInput
): Promise<AccessRule> {
    return request("/access-rules", {
        method: "POST",
        body: JSON.stringify(rule),
    });
}

export function updateAccessRule(
    index: number,
    rule: CreateAccessRuleInput
): Promise<AccessRule> {
    return request(`/access-rules/${index}`, {
        method: "PUT",
        body: JSON.stringify(rule),
    });
}

export function deleteAccessRule(index: number): Promise<void> {
    return request(`/access-rules/${index}`, {
        method: "DELETE",
    });
}