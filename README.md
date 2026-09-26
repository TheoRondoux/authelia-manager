# Authelia Manager

Interface web d'administration pour **Authelia**, permettant de gérer simplement les utilisateurs, groupes et règles d'accès depuis une interface graphique.

Le projet repose sur un frontend React/Vite et une API Node.js servant de couche intermédiaire avec les fichiers de configuration d'Authelia.

---

## ✨ Fonctionnalités

* 👤 Gestion des utilisateurs

    * Création
    * Modification
    * Suppression
    * Gestion des groupes
    * Modification du mot de passe
* 🔐 Gestion des règles `access_control`
    * Création
    * Modification
    * Suppression
* ⚙️ Configuration dynamique des fichiers Authelia

    * Répertoire de configuration
    * Fichier `configuration.yml`
    * Fichier `users_database.yml`
* 🔄 Rechargement d'Authelia depuis l'interface
* 🔑 Hachage des mots de passe avec **Argon2id**
* 🐳 Compatible avec un déploiement Docker
* 🌐 Peut être placé derrière un reverse proxy et une authentification externe

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       Navigateur    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Reverse Proxy     │
                         │   Nginx Proxy Mgr   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │      Authelia Manager       │
                    │                             │
                    │  React / Vite               │
                    │  Node.js API                │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          users_database.yml            configuration.yml
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Authelia    │
                         └─────────────────┘
```

Le frontend **n'accède jamais directement aux fichiers Authelia**.

Toutes les opérations passent par l'API Node.js.

---

# ⚙️ Configuration

La configuration du gestionnaire se trouve dans :

```text
server/config.json
```

Exemple :

```json
{
  "autheliaManager": {
    "configFolder": "./config",
    "configFile": "configuration.yml",
    "usersFile": "users_database.yml"
  }
}
```

## Paramètres

| Paramètre      | Description                                |
| -------------- | ------------------------------------------ |
| `configFolder` | Répertoire contenant les fichiers Authelia |
| `configFile`   | Nom du fichier de configuration principal  |
| `usersFile`    | Nom de la base utilisateurs                |

La configuration est relue dynamiquement par le serveur.

Il est donc possible de la modifier via l'API **sans redémarrer le gestionnaire**.

> En environnement Docker, `configFolder` doit correspondre au chemin du volume monté dans le conteneur du manager.

Par exemple :

```json
{
  "autheliaManager": {
    "configFolder": "/authelia-config",
    "configFile": "configuration.yml",
    "usersFile": "users_database.yml"
  }
}
```

---

# 🐳 Installation avec Docker

## 1. Réseau Docker

Le manager doit pouvoir communiquer avec Authelia.

Si vous utilisez un réseau Docker externe :

```yaml
networks:
  my_custom_net:
    external: true
```

Authelia et le manager doivent être présents sur ce réseau.

---

## 2. Docker Compose

Exemple de configuration à rajouter au Docker compose de Authelia :

```yaml
services:
  authelia-manager:
    build:
      context: ./authelia-manager
      dockerfile: Dockerfile

    container_name: authelia-manager

    volumes:
      # Configuration Authelia
      - ./config:/authelia-config

      # Permet au manager d'exécuter le script de reload
      - /usr/local/bin/reload-authelia.sh:/usr/local/bin/reload-authelia.sh:ro

      # Accès au Docker daemon pour le script de reload
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - my_custom_net
    restart: unless-stopped


networks:
  my_custom_net:
    external: true
```

---

# 🔄 Rechargement d'Authelia

Le manager utilise un script présent sur l'hôte :

```text
/usr/local/bin/reload-authelia.sh
```

Exemple :

```bash
#!/bin/bash

set -e

echo "[authelia-manager] Validation de la configuration..."

docker exec authelia authelia config validate \
    --config /config/configuration.yml

echo "[authelia-manager] Configuration valide."

docker restart authelia

echo "[authelia-manager] Authelia redémarré."
```

Le script effectue deux opérations :

1. Validation de la configuration Authelia
2. Redémarrage du conteneur Authelia

La validation est volontairement effectuée **avant** le redémarrage.

Ainsi, une configuration invalide n'entraîne pas le redémarrage d'Authelia.

---

## Pourquoi utiliser un script ?

Le script permet de centraliser la logique de rechargement et de validation sur l'hôte.

Le manager exécute simplement :

```text
/usr/local/bin/reload-authelia.sh
```

Cela évite de mettre la logique de validation directement dans l'application.

---

# 🔐 Accès au Docker socket

Pour permettre au manager d'exécuter le script, le socket Docker est monté :

```yaml
- /var/run/docker.sock:/var/run/docker.sock
```

Le manager peut ainsi communiquer avec le Docker daemon de l'hôte.

### ⚠️ Sécurité

L'accès au Docker socket est **sensible**.

Un conteneur ayant accès au socket Docker peut potentiellement contrôler les autres conteneurs et, selon la configuration, obtenir des privilèges importants sur l'hôte.

Pour cette raison :

* le manager ne doit pas être exposé directement sur Internet ;
* l'accès doit être protégé par une authentification ;
* le reverse proxy doit être utilisé pour contrôler l'accès ;
* les entrées permettant d'exécuter des commandes doivent rester strictement contrôlées.

Le script de reload est fixe et l'application n'accepte pas de commande Docker arbitraire fournie par l'utilisateur.

---

# 🔑 Mots de passe

Les mots de passe créés ou modifiés depuis l'interface sont hachés côté serveur avec **Argon2id**.

Le mot de passe en clair n'est jamais écrit dans `users_database.yml`.

Exemple :

```yaml
users:
  john:
    password: "$argon2id$v=19$..."
    displayname: "John"
    email: "john@example.com"
    groups:
      - users
```

Les anciens hashes compatibles avec Authelia peuvent continuer à être utilisés.

---

# 👤 Structure de `users_database.yml`

Le fichier doit utiliser la structure attendue par Authelia :

```yaml
users:
  john:
    password: "$argon2id$v=19$..."
    displayname: "John"
    email: "john@example.com"
    groups:
      - users
      - administrators

  jane:
    password: "$argon2id$v=19$..."
    displayname: "Jane"
    email: "jane@example.com"
    groups:
      - users
```

Le nom d'utilisateur est la clé de l'utilisateur.

Il ne faut **pas** utiliser une liste :

```yaml
users:
  - username: john
    ...
```

Le manager utilise un objet indexé par nom d'utilisateur.

---

# 🔐 Règles d'accès

Le manager permet également de modifier :

```yaml
access_control:
  default_policy: deny

  rules:
    - domain: "example.com"
      policy: one_factor
      subject:
        - "group:users"
```

Les opérations disponibles sont :

* création d'une règle ;
* modification d'une règle ;
* suppression d'une règle.

Contrairement aux utilisateurs, les modifications de `configuration.yml` nécessitent un rechargement d'Authelia pour être prises en compte.

Le bouton de rechargement de l'interface utilise donc le script :

```text
reload-authelia.sh
```

---

# 🏭 Build Docker

Construire l'image :

```bash
docker compose build
```

Forcer une reconstruction complète :

```bash
docker compose build --no-cache authelia-manager
```

Démarrer :

```bash
docker compose up -d
```

Voir les logs :

```bash
docker logs -f authelia-manager
```
