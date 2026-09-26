import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getGroups,
    getAccessRules,
    createAccessRule,
    updateAccessRule,
    deleteAccessRule,
    reloadAuthelia,
    getOidcClients,
    createOidcClient,
    updateOidcClient,
    deleteOidcClient,
} from "./authelia.js";
import {
    readConfig,
    writeConfig,
} from "./config.js";

const PORT = Number(process.env.PORT ?? 3001);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// En production :
// /app/dist-server/index.js
// /app/dist
const DIST_DIR = path.resolve(__dirname, "../dist");

const server = http.createServer(async (req, res) => {
    try {
        const method = req.method ?? "GET";
        const requestUrl = new URL(
            req.url ?? "/",
            `http://${req.headers.host ?? "localhost"}`
        );

        const pathname = requestUrl.pathname;

        /*
         * ============================================================
         * API
         * ============================================================
         */

        if (pathname.startsWith("/api/")) {
            await handleApi(req, res, method, pathname);
            return;
        }

        /*
         * ============================================================
         * FRONTEND REACT
         * ============================================================
         */

        if (method === "GET") {
            await serveFrontend(res, pathname);
            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });
    } catch (error) {
        console.error("Server error:", error);

        if (!res.headersSent) {
            sendJson(res, 500, {
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    }
});

/*
 * ================================================================
 * API HANDLER
 * ================================================================
 */

async function handleApi(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    method: string,
    pathname: string
): Promise<void> {
    /*
     * GET /api/health
     */

    if (pathname === "/api/health" && method === "GET") {
        sendJson(res, 200, {
            status: "ok",
        });

        return;
    }

    /*
     * ============================================================
     * USERS
     * ============================================================
     */

    if (pathname === "/api/authelia/users") {
        if (method === "GET") {
            const users = await getUsers();

            sendJson(res, 200, users);
            return;
        }

        if (method === "POST") {
            const body = await readJson(req);

            const user = await createUser(body.username, {
                password: body.password,
                displayname: body.displayname,
                email: body.email,
                groups: body.groups,
            });
            sendJson(res, 201, user);
            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });

        return;
    }

    /*
     * /api/authelia/users/:username
     */

    const userMatch = pathname.match(
        /^\/api\/authelia\/users\/([^/]+)$/
    );

    if (userMatch) {
        const username = decodeURIComponent(userMatch[1]);

        if (method === "GET") {
            const user = await getUser(username);

            if (!user) {
                sendJson(res, 404, {
                    error: "User not found",
                });

                return;
            }

            sendJson(res, 200, user);
            return;
        }

        if (method === "PUT") {
            const body = await readJson(req);

            const user = await updateUser(username, body);

            if (!user) {
                sendJson(res, 404, {
                    error: "User not found",
                });

                return;
            }

            sendJson(res, 200, user);
            return;
        }

        if (method === "DELETE") {
            const deleted = await deleteUser(username);

            sendJson(res, 200, {
                success: true,
            });

            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });

        return;
    }

    /*
     * ============================================================
     * GROUPS
     * ============================================================
     */

    if (pathname === "/api/authelia/groups") {
        if (method === "GET") {
            const groups = await getGroups();

            sendJson(res, 200, groups);
            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });

        return;
    }

    /*
 * ============================================================
 * ACCESS RULES
 * ============================================================
 */

    if (pathname === "/api/authelia/access-rules") {
        if (method === "GET") {
            const rules = await getAccessRules();

            sendJson(res, 200, rules);
            return;
        }

        if (method === "POST") {
            const body = await readJson(req);

            const rule = await createAccessRule({
                domain: body.domain,
                policy: body.policy,
                ...(body.subject !== undefined
                    ? { subject: body.subject }
                    : {}),
            });

            sendJson(res, 201, rule);
            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });

        return;
    }

    /*
     * /api/authelia/access-rules/:index
     */

    const ruleMatch = pathname.match(
        /^\/api\/authelia\/access-rules\/(\d+)$/
    );

    if (ruleMatch) {
        const index = Number(ruleMatch[1]);

        if (method === "PUT") {
            const body = await readJson(req);

            const rule = await updateAccessRule(index, {
                domain: body.domain,
                policy: body.policy,
                ...(body.subject !== undefined
                    ? { subject: body.subject }
                    : {}),
            });

            sendJson(res, 200, rule);
            return;
        }

        if (method === "DELETE") {
            await deleteAccessRule(index);

            sendJson(res, 200, {
                success: true,
            });

            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });

        return;
    }

    /*
     * ============================================================
     * RELOAD AUTHELIA
     * ============================================================
     */

    if (pathname === "/api/authelia/reload") {
        if (method === "POST") {
            const result = await reloadAuthelia();

            sendJson(res, 200, result);
            return;
        }

        sendJson(res, 405, {
            error: "Method not allowed",
        });

        return;
    }

        /*
     * ============================================================
     * CONFIGURATION AUTHELIA MANAGER
     * ============================================================
     */

    if (req.method === "GET" && req.url === "/api/authelia/config") {
        const config = await readConfig();

        sendJson(res, 200, config);
        return;
    }

    if (req.method === "PUT" && req.url === "/api/authelia/config") {
        const body = await readJson(req);

        if (
            typeof body.configFolder !== "string" ||
            typeof body.configFile !== "string" ||
            typeof body.usersFile !== "string"
        ) {
            sendJson(res, 400, {
                error: "Configuration Authelia invalide",
            });
            return;
        }

        const config = await readConfig();

        config.autheliaManager = {
            configFolder: body.configFolder,
            configFile: body.configFile,
            usersFile: body.usersFile,
        };

        await writeConfig(config);

        sendJson(res, 200, config.autheliaManager);
        return;
    }


    /*
     * ============================================================
     * OIDC CLIENTS
     * ============================================================
     */

    // GET OIDC clients
    if (
        req.method === "GET" &&
        req.url === "/api/authelia/oidc/clients"
    ) {
        const clients = await getOidcClients();

        sendJson(res, 200, clients);
        return;
    }

// CREATE OIDC client
    if (
        req.method === "POST" &&
        req.url === "/api/authelia/oidc/clients"
    ) {
        const body = await readJson(req);

        const client = await createOidcClient(body);

        sendJson(res, 201, client);
        return;
    }

// UPDATE OIDC client
    const updateMatch = req.url?.match(
        /^\/api\/authelia\/oidc\/clients\/([^/]+)$/
    );

    if (
        req.method === "PUT" &&
        updateMatch
    ) {
        const clientId = decodeURIComponent(updateMatch[1]);

        const body = await readJson(req);

        const client = await updateOidcClient(
            clientId,
            body
        );

        sendJson(res, 200, client);
        return;
    }

// DELETE OIDC client
    const deleteMatch = req.url?.match(
        /^\/api\/authelia\/oidc\/clients\/([^/]+)$/
    );

    if (
        req.method === "DELETE" &&
        deleteMatch
    ) {
        const clientId = decodeURIComponent(deleteMatch[1]);

        await deleteOidcClient(clientId);

        sendJson(res, 200, {
            success: true,
        });

        return;
    }

    /*
     * ============================================================
     * ROUTE INCONNUE
     * ============================================================
     */

    sendJson(res, 404, {
        error: "API route not found",
    });
}

/*
 * ================================================================
 * FRONTEND
 * ================================================================
 */

async function serveFrontend(
    res: http.ServerResponse,
    pathname: string
): Promise<void> {
    let filePath: string;

    /*
     * La racine / doit retourner index.html
     */

    if (pathname === "/") {
        filePath = path.join(DIST_DIR, "index.html");
    } else {
        /*
         * On retire le "/" initial.
         *
         * Exemple :
         * /assets/index.js
         * ->
         * /app/dist/assets/index.js
         */

        const relativePath = pathname.replace(/^\/+/, "");

        filePath = path.join(DIST_DIR, relativePath);
    }

    /*
     * Sécurité :
     * empêcher de sortir du dossier dist avec ../
     */

    const normalizedDist = path.resolve(DIST_DIR);
    const normalizedFile = path.resolve(filePath);

    if (
        normalizedFile !== normalizedDist &&
        !normalizedFile.startsWith(`${normalizedDist}${path.sep}`)
    ) {
        sendText(res, 403, "Forbidden");
        return;
    }

    try {
        const stat = await fs.stat(normalizedFile);

        if (stat.isFile()) {
            await sendFile(res, normalizedFile);
            return;
        }
    } catch {
        // Le fichier n'existe pas.
    }

    /*
     * SPA fallback
     *
     * Exemple :
     * /users
     * /groups
     * /access-rules
     *
     * React Router doit recevoir index.html.
     */

    const indexPath = path.join(DIST_DIR, "index.html");

    try {
        await sendFile(res, indexPath);
    } catch {
        sendText(res, 404, "Frontend not found");
    }
}

/*
 * ================================================================
 * FILE SERVER
 * ================================================================
 */

async function sendFile(
    res: http.ServerResponse,
    filePath: string
): Promise<void> {
    const content = await fs.readFile(filePath);

    const contentType = getContentType(filePath);

    res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": content.length,
    });

    res.end(content);
}

function getContentType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case ".html":
            return "text/html; charset=utf-8";

        case ".js":
            return "application/javascript; charset=utf-8";

        case ".mjs":
            return "application/javascript; charset=utf-8";

        case ".css":
            return "text/css; charset=utf-8";

        case ".json":
            return "application/json; charset=utf-8";

        case ".svg":
            return "image/svg+xml";

        case ".png":
            return "image/png";

        case ".jpg":
        case ".jpeg":
            return "image/jpeg";

        case ".gif":
            return "image/gif";

        case ".webp":
            return "image/webp";

        case ".ico":
            return "image/x-icon";

        case ".woff":
            return "font/woff";

        case ".woff2":
            return "font/woff2";

        case ".ttf":
            return "font/ttf";

        default:
            return "application/octet-stream";
    }
}

/*
 * ================================================================
 * REQUEST BODY
 * ================================================================
 */

async function readJson(
    req: http.IncomingMessage
): Promise<any> {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
        chunks.push(
            Buffer.isBuffer(chunk)
                ? chunk
                : Buffer.from(chunk)
        );
    }

    const body = Buffer.concat(chunks).toString("utf8");

    if (!body) {
        return {};
    }

    try {
        return JSON.parse(body);
    } catch {
        throw new Error("Invalid JSON body");
    }
}

/*
 * ================================================================
 * RESPONSES
 * ================================================================
 */

function sendJson(
    res: http.ServerResponse,
    statusCode: number,
    data: unknown
): void {
    const body = JSON.stringify(data);

    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
    });

    res.end(body);
}

function sendText(
    res: http.ServerResponse,
    statusCode: number,
    message: string
): void {
    res.writeHead(statusCode, {
        "Content-Type": "text/plain; charset=utf-8",
    });

    res.end(message);
}

/*
 * ================================================================
 * SERVER START
 * ================================================================
 */

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Authelia Manager listening on port ${PORT}`);
    console.log(`Frontend directory: ${DIST_DIR}`);
});