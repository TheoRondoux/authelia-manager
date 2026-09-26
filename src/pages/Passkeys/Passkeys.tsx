import type {WebAuthnConfig} from "../../api/types.ts";
import {useEffect, useState} from "react";
import {getWebAuthnConfig} from "../../api/authelia/webauthn.ts";
import {Button, Input} from "../../components";
import {IconDeviceFloppy} from "@tabler/icons-react";

const Passkeys = () => {

    const [webauthnConfig, setWebauthnConfig] = useState<WebAuthnConfig>(null);

    const fetchWebAuthnConfig = () => {
        getWebAuthnConfig().then((config) => {
            setWebauthnConfig(config);
        });
    }

    useEffect(() => {
        fetchWebAuthnConfig();
    }, []);

    return (
        <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2 justify-center items-start'}>
                <h1 className={'text-4xl font-semibold'}>Passkeys</h1>
                <p className={'text-gray-500'}>Gérez les passkeys ici.</p>
            </div>
            <div className={'flex flex-col gap-2'}>
                {webauthnConfig &&
                    <div className={'flex flex-col gap-2 p-4 border border-gray-200 rounded-xl shadow-md'}>
                        <div>
                            <h2 className={'text-lg font-semibold'}>Configuration WebAuthn</h2>
                            <p className={'text-gray-500'}>Paramètres de configuration pour WebAuthn.</p>
                        </div>
                        <label>
                            Activé
                            <input type={"checkbox"} checked={!webauthnConfig.disable}/>
                        </label>
                        {!webauthnConfig.disable && (
                            <>
                                <Input
                                    label={"Nom"}
                                    value={webauthnConfig.display_name}
                                />
                                <Input
                                    label={"Timeout"}
                                    value={webauthnConfig.timeout}
                                />
                            </>
                        )}
                        <div className={'w-fit'}>
                            <Button startSlot={<IconDeviceFloppy size={20}/>} disabled={webauthnConfig.disable}>
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
export default Passkeys;