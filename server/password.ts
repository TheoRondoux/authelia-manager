import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
    if (!password || password.length < 8) {
        throw new Error(
            "Le mot de passe doit contenir au moins 8 caractères"
        );
    }

    return argon2.hash(password, {
        type: argon2.argon2id,

        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,

        hashLength: 32,
    });
}