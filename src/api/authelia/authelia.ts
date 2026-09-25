import type {
    AutheliaConfig,
} from "../types.ts";

export const API_BASE = "/api/authelia";

export async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        let message = `Erreur API (${response.status})`;

        try {
            const body = await response.json();

            if (body.message) {
                message = body.message;
            }
        } catch {
            // Réponse non JSON
        }

        throw new Error(message);
    }

    return response.json();
}

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                      */
/* -------------------------------------------------------------------------- */

export function getConfig(): Promise<AutheliaConfig> {
    return request("/config");
}

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                      */
/* -------------------------------------------------------------------------- */

export function reloadAuthelia(): Promise<{
    success: boolean;
    message: string;
}> {
    return request("/reload", {
        method: "POST",
    });
}