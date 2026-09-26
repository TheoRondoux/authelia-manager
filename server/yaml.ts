import fs from "node:fs/promises";
import YAML from "yaml";

export async function readYaml<T>(file: string): Promise<T> {
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