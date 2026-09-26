import {useEffect, useState, type FormEvent} from "react";
import type {OidcClient} from "../../../api/types.ts";
import {createOidcClient, updateOidcClient} from "../../../api/authelia/oidc.ts";
import {Button, Input, Loader, Modal} from "../../../components";

const POLICIES = ["bypass", "one_factor", "two_factor", "deny"];
const SCOPES = ["openid", "profile", "email", "address", "phone", "offline_access"];

interface OidcClientModalProps {
    isOpen: boolean;
    client: OidcClient | null;
    onClose: () => void;
    onSaved: () => void;
}

const toLines = (values?: string[]) => values?.join("\n") ?? "";

export const OidcClientModal = ({isOpen, client, onClose, onSaved}: OidcClientModalProps) => {
    const [clientId, setClientId] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [authorizationPolicy, setAuthorizationPolicy] = useState("one_factor");
    const [requirePkce, setRequirePkce] = useState(true);
    const [pkceChallengeMethod, setPkceChallengeMethod] = useState("S256");
    const [redirectUris, setRedirectUris] = useState("");
    const [scopes, setScopes] = useState<string[]>(["openid", "profile", "email"]);
    const [responseTypes, setResponseTypes] = useState("code");
    const [grantTypes, setGrantTypes] = useState("authorization_code");
    const [accessTokenAlgorithm, setAccessTokenAlgorithm] = useState("none");
    const [userinfoAlgorithm, setUserinfoAlgorithm] = useState("none");
    const [tokenAuthMethod, setTokenAuthMethod] = useState("client_secret_basic");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setClientId(client?.client_id ?? "");
        setClientName(client?.client_name ?? "");
        setClientSecret("");
        setIsPublic(client?.public ?? false);
        setAuthorizationPolicy(client?.authorization_policy ?? "one_factor");
        setRequirePkce(client?.require_pkce ?? true);
        setPkceChallengeMethod(client?.pkce_challenge_method ?? "S256");
        setRedirectUris(toLines(client?.redirect_uris));
        setScopes(client?.scopes?.length ? client.scopes : ["openid", "profile", "email"]);
        setResponseTypes(toLines(client?.response_types) || "code");
        setGrantTypes(toLines(client?.grant_types) || "authorization_code");
        setAccessTokenAlgorithm(client?.access_token_signed_response_alg ?? "none");
        setUserinfoAlgorithm(client?.userinfo_signed_response_alg ?? "none");
        setTokenAuthMethod(client?.token_endpoint_auth_method ?? "client_secret_basic");
        setError(null);
    }, [isOpen, client]);

    const handleClose = () => {
        if (!isSaving) {
            onClose();
        }
    };

    const toggleScope = (scope: string) => {
        setScopes((current) =>
            current.includes(scope)
                ? current.filter((item) => item !== scope)
                : [...current, scope]
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const splitLines = (value: string) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        const parsedRedirectUris = splitLines(redirectUris);
        const parsedResponseTypes = splitLines(responseTypes);
        const parsedGrantTypes = splitLines(grantTypes);

        if (!clientId.trim() || !clientName.trim() || !authorizationPolicy || !parsedRedirectUris.length || !scopes.length || !parsedResponseTypes.length || !parsedGrantTypes.length) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const oidcClient: OidcClient = {
            client_id: clientId.trim(),
            client_name: clientName.trim(),
            ...(clientSecret.trim() ? {client_secret: clientSecret.trim()} : client?.client_secret ? {client_secret: client.client_secret} : {}),
            public: isPublic,
            authorization_policy: authorizationPolicy,
            require_pkce: requirePkce,
            ...(pkceChallengeMethod ? {pkce_challenge_method: pkceChallengeMethod} : {}),
            redirect_uris: parsedRedirectUris,
            scopes,
            response_types: parsedResponseTypes,
            grant_types: parsedGrantTypes,
            ...(accessTokenAlgorithm ? {access_token_signed_response_alg: accessTokenAlgorithm} : {}),
            ...(userinfoAlgorithm ? {userinfo_signed_response_alg: userinfoAlgorithm} : {}),
            ...(tokenAuthMethod ? {token_endpoint_auth_method: tokenAuthMethod} : {}),
        };

        setIsSaving(true);
        setError(null);
        try {
            if (client) {
                await updateOidcClient(client.client_id, oidcClient);
            } else {
                await createOidcClient(oidcClient);
            }
            onSaved();
            onClose();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Impossible d'enregistrer le client OIDC");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <form onSubmit={handleSubmit} className="w-[min(90vw,42rem)] max-h-[85vh] overflow-y-auto px-2">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">{client ? "Modifier le client OIDC" : "Ajouter un client OIDC"}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label={<>ID du client <span className="text-red-600">*</span></>}
                            value={clientId}
                            onChange={(event) => setClientId(event.target.value)}
                            required
                            disabled={!!client}
                        />
                        <Input
                            label={<>Nom du client <span className="text-red-600">*</span></>}
                            value={clientName}
                            onChange={(event) => setClientName(event.target.value)}
                            required
                        />
                        <Input
                            label="Secret du client (facultatif)"
                            type="password"
                            value={clientSecret}
                            onChange={(event) => setClientSecret(event.target.value)}
                            placeholder={client?.client_secret ? "Laisser vide pour conserver le secret" : ""}
                            autoComplete="new-password"
                        />
                        <div className="flex flex-col gap-1">
                            <label htmlFor="oidc-policy" className="text-sm text-gray-600">Politique d'autorisation <span className="text-red-600">*</span></label>
                            <select
                                id="oidc-policy"
                                value={authorizationPolicy}
                                onChange={(event) => setAuthorizationPolicy(event.target.value)}
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800"
                            >
                                {POLICIES.map((policy) => <option key={policy} value={policy}>{policy}</option>)}
                            </select>
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />
                        Client public
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={requirePkce} onChange={(event) => setRequirePkce(event.target.checked)} />
                        Exiger PKCE
                    </label>

                    {requirePkce && (
                        <div className="flex flex-col gap-1">
                            <label htmlFor="oidc-pkce-method" className="text-sm text-gray-600">Méthode PKCE</label>
                            <select
                                id="oidc-pkce-method"
                                value={pkceChallengeMethod}
                                onChange={(event) => setPkceChallengeMethod(event.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800"
                            >
                                <option value="S256">S256</option>
                                <option value="plain">plain</option>
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="oidc-redirect-uris" className="text-sm text-gray-600">URI de redirection <span className="text-red-600">*</span></label>
                            <textarea
                                id="oidc-redirect-uris"
                                value={redirectUris}
                                onChange={(event) => setRedirectUris(event.target.value)}
                                required
                                rows={3}
                                placeholder="Une URI par ligne"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="oidc-response-types" className="text-sm text-gray-600">Types de réponse <span className="text-red-600">*</span></label>
                            <textarea
                                id="oidc-response-types"
                                value={responseTypes}
                                onChange={(event) => setResponseTypes(event.target.value)}
                                required
                                rows={2}
                                placeholder="code"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="oidc-grant-types" className="text-sm text-gray-600">Types d'autorisation <span className="text-red-600">*</span></label>
                            <textarea
                                id="oidc-grant-types"
                                value={grantTypes}
                                onChange={(event) => setGrantTypes(event.target.value)}
                                required
                                rows={2}
                                placeholder="authorization_code"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800"
                            />
                        </div>
                    </div>

                    <fieldset className="flex flex-col gap-1">
                        <legend className="text-sm text-gray-600">Scopes <span className="text-red-600">*</span></legend>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                            {SCOPES.map((scope) => (
                                <label key={scope} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={scopes.includes(scope)}
                                        onChange={() => toggleScope(scope)}
                                    />
                                    {scope}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Input
                            label="Algorithme de signature du jeton (facultatif)"
                            value={accessTokenAlgorithm}
                            onChange={(event) => setAccessTokenAlgorithm(event.target.value)}
                            placeholder="none"
                        />
                        <Input
                            label="Algorithme de signature UserInfo (facultatif)"
                            value={userinfoAlgorithm}
                            onChange={(event) => setUserinfoAlgorithm(event.target.value)}
                            placeholder="none"
                        />
                        <Input
                            label="Méthode d'authentification du jeton (facultatif)"
                            value={tokenAuthMethod}
                            onChange={(event) => setTokenAuthMethod(event.target.value)}
                            placeholder="client_secret_basic"
                        />
                    </div>
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={handleClose} variant="secondary" disabled={isSaving}>Annuler</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader size={20} /> : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
