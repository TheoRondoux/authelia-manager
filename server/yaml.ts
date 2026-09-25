import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const CONFIG_DIR =
    process.env.AUTHELIA_CONFIG_DIR ??
    path.resolve("./config");

export const CONFIGURATION_FILE = path.join(
    CONFIG_DIR,
    "configuration.yml"
);

export const USERS_FILE = path.join(
    CONFIG_DIR,
    "users_database.yml"
);

export async function readYaml<T>(
    file: string
): Promise<T> {
    const content = await fs.readFile(file, "utf8");

    return YAML.parse(content) as T;
}

export async function writeYaml(
    file: string,
    data: unknown
): Promise<void> {
    const content = YAML.stringify(data, {
        indent: 2,
    });

    await fs.writeFile(file, content, "utf8");
}