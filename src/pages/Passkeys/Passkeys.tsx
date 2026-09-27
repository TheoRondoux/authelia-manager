import type {WebAuthnConfig} from "../../api/types.ts";
import {useEffect, useState} from "react";
import {getWebAuthnConfig, updateWebAuthnConfig} from "../../api/authelia/webauthn.ts";
import {Button, Input} from "../../components";
import {
    IconCertificate,
    IconClock,
    IconDeviceFloppy,
    IconDevices,
    IconKey,
    IconLabel,
    IconUser
} from "@tabler/icons-react";
import Toggle from "../../components/Toggle/Toggle.tsx";
import {ParamElem} from "./components/ParamElem.tsx";

const ATTESTATION_OPTIONS = ["none", "indirect", "direct"];
const ATTACHMENT_OPTIONS = ["", "platform", "cross-platform"];
const DISCOVERABILITY_OPTIONS = ["required", "preferred", "discouraged"];
const USER_VERIFICATION_OPTIONS = ["required", "preferred", "discouraged"];

const Passkeys = () => {

    const [webauthnConfig, setWebauthnConfig] = useState<WebAuthnConfig | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchWebAuthnConfig = () => {
        getWebAuthnConfig().then((config) => {
            setWebauthnConfig(config);
        });
    }

    const handleToggleWebAuthn = () => {
        if (webauthnConfig === null || webauthnConfig === undefined || webauthnConfig.disable === undefined) {
            const defaultConfig: WebAuthnConfig = {
                disable: false
            }
            setWebauthnConfig(defaultConfig);
            updateWebAuthnConfig(defaultConfig)
                .catch((error) => {
                    console.error("Erreur lors de la mise à jour de la configuration WebAuthn :", error);
                });
            return;
        }

        const newConfig = { ...webauthnConfig, disable: !webauthnConfig?.disable };
        setWebauthnConfig(newConfig);
        setUpdating(true);
        updateWebAuthnConfig(newConfig)
            .catch((error) => {
                console.error("Erreur lors de la mise à jour de la configuration WebAuthn :", error);
            })
            .finally(() => {
                setUpdating(false);
            });
    }

    const handleSaveWebAuthnConfig = () => {
        if (webauthnConfig) {
            setUpdating(true);
            updateWebAuthnConfig(webauthnConfig)
                .catch((error) => {
                    console.error("Erreur lors de la mise à jour de la configuration WebAuthn :", error);
                })
                .finally(() => {
                    setUpdating(false);
                });
        }
    }

    useEffect(() => {
        fetchWebAuthnConfig();
    }, []);

    return (
        <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2 justify-center items-start'}>
                <h1 className={'text-4xl font-semibold'}>Passkeys</h1>
                <p className={'text-gray-500'}>Gérez la configuration des passkeys ici.</p>
            </div>
            <div className={'flex flex-col gap-2'}>
                {webauthnConfig &&
                    <div className={'flex flex-col gap-2 p-4 border border-gray-200 rounded-xl shadow-md'}>
                        <div className={'flex items-start justify-between gap-2'}>
                            <div>
                                <h2 className={'text-lg font-semibold'}>Configuration WebAuthn</h2>
                                <p className={'text-gray-500'}>Paramètres de configuration pour WebAuthn.</p>
                            </div>
                            <Toggle isOn={(webauthnConfig.disable !== undefined && !webauthnConfig.disable)} onToggle={() => handleToggleWebAuthn()} />
                        </div>

                        {(webauthnConfig.disable !== undefined && !webauthnConfig.disable) && (
                            <>
                                <section className={'flex flex-col gap-2 py-4'}>
                                    <div className={('w-fit')}>
                                        <h3 className={'text-md font-semibold text-lg'}>Général</h3>
                                        <div className={'block h-px bg-gray-200 w-1/2'} />
                                    </div>
                                    <ParamElem
                                        icon={<IconKey size={20}/>}
                                        title={"Connexion par passkey"}
                                        input={
                                            <Toggle
                                                isOn={webauthnConfig.enable_passkey_login}
                                                onToggle={() => setWebauthnConfig({...webauthnConfig, enable_passkey_login: !webauthnConfig.enable_passkey_login})}
                                            />
                                        }
                                        description={"Permet aux utilisateurs de se connecter en utilisant des passkeys."}
                                    />
                                    <ParamElem
                                        icon={<IconLabel size={20}/>}
                                        title={"Nom"}
                                        input={<Input
                                            value={webauthnConfig.display_name}
                                            placeholder={'Ex: Authelia'}
                                            onChange={(e) => setWebauthnConfig({...webauthnConfig, display_name: e.target.value})}
                                        />}
                                        description={"Le nom affiché pour la configuration WebAuthn."}
                                    />
                                    <ParamElem
                                        icon={<IconClock size={20}/>}
                                        title={"Timeout"}
                                        input={<Input
                                            value={webauthnConfig.timeout}
                                            onChange={(e) => setWebauthnConfig({...webauthnConfig, timeout: e.target.value})}
                                            placeholder={'Ex: 60 seconds'}
                                        />}
                                        description={"Le délai d'attente pour la configuration WebAuthn."}
                                    />
                                    <ParamElem
                                        icon={<IconCertificate size={20}/>}
                                        title={"Attestation"}
                                        input={
                                            <select
                                                value={webauthnConfig.attestation_conveyance_preference}
                                                defaultValue={""}
                                                onChange={(e) => setWebauthnConfig({...webauthnConfig, attestation_conveyance_preference: e.target.value})}
                                                className={'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800'}
                                            >
                                                <option disabled value={""}>default: indirect</option>
                                                {ATTESTATION_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        }
                                        description={"Détermine quelles informations sur l’authentificateur sont demandées lors de l’enregistrement d’une clé WebAuthn"}
                                    />
                                </section>
                                <section className={'flex flex-col gap-2 py-4'}>
                                    <div className={'w-fit'}>
                                        <h3 className={'text-md font-semibold text-lg'}>Critères de sélection</h3>
                                        <div className={'block h-px bg-gray-200 w-1/2'} />
                                    </div>
                                    <ParamElem
                                        icon={<IconDevices size={20}/>}
                                        title={"Attachment"}
                                        input={
                                            <select
                                                value={webauthnConfig.selection_criteria?.attachment}
                                                onChange={(e) => setWebauthnConfig({...webauthnConfig, selection_criteria: {...webauthnConfig.selection_criteria, attachment: e.target.value}})}
                                                className={'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800'}
                                            >
                                                {ATTACHMENT_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option || "Aucun"}</option>
                                                ))}
                                            </select>
                                        }
                                        description={"Détermine si l’authentificateur doit être intégré à l’appareil ou peut être externe."}
                                    />
                                    <ParamElem
                                        icon={<IconUser size={20}/>}
                                        title={"Discoverability"}
                                        input={
                                            <select
                                                value={webauthnConfig.selection_criteria?.discoverability}
                                                defaultValue={""}
                                                onChange={(e) => setWebauthnConfig({...webauthnConfig, selection_criteria: {...webauthnConfig.selection_criteria, discoverability: e.target.value}})}
                                                className={'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800'}
                                            >
                                                <option value={""} disabled>default: preferred</option>
                                                {DISCOVERABILITY_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option || "Aucun"}</option>
                                                ))}
                                            </select>
                                        }
                                        description={"Détermine si la clé peut être utilisée sans sélectionner ou saisir un compte au préalable."}
                                    />
                                    <ParamElem
                                        icon={<IconUser size={20}/>}
                                        title={"Vérification de l’utilisateur"}
                                        input={
                                            <select
                                                value={webauthnConfig.selection_criteria?.user_verification}
                                                defaultValue={""}
                                                onChange={(e) => setWebauthnConfig({...webauthnConfig, selection_criteria: {...webauthnConfig.selection_criteria, user_verification: e.target.value}})}
                                                className={'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800'}
                                            >
                                                <option value={""} disabled>default: preferred</option>
                                                {USER_VERIFICATION_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option || "Aucun"}</option>
                                                ))}
                                            </select>
                                        }
                                        description={"Détermine si une vérification supplémentaire de l’utilisateur est requise lors de l’authentification."}
                                    />
                                </section>
                                <div className={'w-fit'}>
                                    <Button startSlot={<IconDeviceFloppy size={20}/>} onClick={handleSaveWebAuthnConfig} disabled={updating}>
                                        {updating ? "Enregistrement..." : "Enregistrer"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}
export default Passkeys;