import { request } from "./authelia";

export type AppConfig = {
    autheliaManager: {
        configFolder: string;
        configFile: string;
        usersFile: string;
    };
};

export function getConfig(): Promise<AppConfig> {
    return request("/config");
}

export function updateAutheliaManagerConfig(
    config: AppConfig["autheliaManager"]
): Promise<AppConfig["autheliaManager"]> {
    return request("/config", {
        method: "PUT",
        body: JSON.stringify(config),
    });
}