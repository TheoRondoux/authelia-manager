import fs from "node:fs/promises";
import path from "node:path";

const CONFIG_FILE = path.join(
    import.meta.dirname,
    "config.json"
);

export type AppConfig = {
    autheliaManager: {
        configFolder: string;
        configFile: string;
        usersFile: string;
    };
};

export async function readConfig(): Promise<AppConfig> {
    const content = await fs.readFile(CONFIG_FILE, "utf8");

    return JSON.parse(content) as AppConfig;
}

export async function writeConfig(config: AppConfig): Promise<void> {
    const content = JSON.stringify(config, null, 2) + "\n";

    await fs.writeFile(CONFIG_FILE, content, "utf8");
}

export async function getConfigurationFile(): Promise<string> {
    const config = await readConfig();

    return path.resolve(
        config.autheliaManager.configFolder,
        config.autheliaManager.configFile
    );
}

export async function getUsersFile(): Promise<string> {
    const config = await readConfig();

    return path.resolve(
        config.autheliaManager.configFolder,
        config.autheliaManager.usersFile
    );
}