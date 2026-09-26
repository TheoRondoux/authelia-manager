import { request } from "./authelia";
import type { WebAuthnConfig } from "../types";

export function getWebAuthnConfig(): Promise<WebAuthnConfig> {
    return request("/webauthn");
}

export function updateWebAuthnConfig(
    config: WebAuthnConfig
): Promise<WebAuthnConfig> {
    return request("/webauthn", {
        method: "PUT",
        body: JSON.stringify(config),
    });
}