import { request } from "./authelia";
import type { OidcClient } from "../types";

export function getOidcClients(): Promise<OidcClient[]> {
    return request("/oidc/clients");
}

export function createOidcClient(
    client: OidcClient
): Promise<OidcClient> {
    return request("/oidc/clients", {
        method: "POST",
        body: JSON.stringify(client),
    });
}

export function updateOidcClient(
    clientId: string,
    client: OidcClient
): Promise<OidcClient> {
    return request(
        `/oidc/clients/${encodeURIComponent(clientId)}`,
        {
            method: "PUT",
            body: JSON.stringify(client),
        }
    );
}

export function deleteOidcClient(
    clientId: string
): Promise<void> {
    return request(
        `/oidc/clients/${encodeURIComponent(clientId)}`,
        {
            method: "DELETE",
        }
    );
}