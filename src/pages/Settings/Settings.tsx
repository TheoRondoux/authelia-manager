import {useEffect, useState} from "react";
import {type AppConfig, getConfig, updateAutheliaManagerConfig} from "../../api/authelia/config.ts";
import {Button, Input} from "../../components";
import {IconDeviceFloppy, IconFileDatabase, IconFileSettings, IconFolder} from "@tabler/icons-react";

const Settings = () => {

    const [managerConfig, setManagerConfig] = useState<AppConfig | null>(null);

    const fetchManagerConfig = () => {
        getConfig()
            .then((data: AppConfig) => {
                setManagerConfig(data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération de la configuration :", error);
            });
    };

    const handleSaveConfig = () => {
        if (managerConfig) {
            updateAutheliaManagerConfig(managerConfig.autheliaManager)
                .then((updatedConfig) => {
                    setManagerConfig(prev => prev ? { ...prev, autheliaManager: updatedConfig } : null);
                })
                .catch((error) => {
                    console.error("Erreur lors de la mise à jour de la configuration :", error);
                });
        }
    }

    useEffect(() => {
        fetchManagerConfig();
    }, []);

    return (
        <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2 justify-center items-start'}>
                <h1 className={'text-4xl font-semibold'}>Paramètres</h1>
                <p className={'text-gray-500'}>Gérez les paramètres du manager.</p>
            </div>
            <div className={'flex flex-col gap-4 border border-gray-200 rounded-xl p-4 shadow-md'}>
                <div className={'flex flex-col gap-2'}>
                    <p className={'text-lg font-semibold'}>Chemins d'installation</p>
                    <p className={'text-gray-500'}>Ces chemins sont utilisés comme référence pour déployer la configuration générée.</p>
                </div>
                <div className={'flex flex-col gap-4'}>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'flex items-center gap-2'}>
                            <IconFolder size={20} />
                            <p className={'font-semibold'}>Dossier de configuration</p>
                        </div>
                        <Input
                            value={managerConfig?.autheliaManager?.configFolder}
                            onChange={
                                (e) =>
                                    setManagerConfig(
                                        prev =>
                                            prev ? {
                                                ...prev,
                                                autheliaManager: {
                                                    ...prev.autheliaManager,
                                                    configFolder: e.target.value
                                                }
                                            } : null
                                    )
                            }
                            placeholder={'./config'}
                        />
                        <p className={'text-sm text-gray-500'}>Le dossier contenant vos fichiers de configuration Authelia.</p>
                    </div>
                </div>
                <div className={'flex flex-col gap-4'}>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'flex items-center gap-2'}>
                            <IconFileSettings size={20} />
                            <p className={'font-semibold'}>Fichier de configuration</p>
                        </div>
                        <Input
                            value={managerConfig?.autheliaManager?.configFile}
                            onChange={
                                (e) =>
                                    setManagerConfig(
                                        prev =>
                                            prev ? {
                                                ...prev,
                                                autheliaManager: {
                                                    ...prev.autheliaManager,
                                                    configFile: e.target.value
                                                }
                                            } : null
                                    )
                            }
                            placeholder={'configuration.yml'}
                        />
                        <p className={'text-sm text-gray-500'}>Le fichier configuration.yml principal d'Authelia.</p>
                    </div>
                </div>
                <div className={'flex flex-col gap-4'}>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'flex items-center gap-2'}>
                            <IconFileDatabase size={20} />
                            <p className={'font-semibold'}>Fichier utilisateurs</p>
                        </div>
                        <Input
                            value={managerConfig?.autheliaManager?.usersFile}
                            onChange={
                                (e) =>
                                    setManagerConfig(
                                        prev =>
                                            prev ? {
                                                ...prev,
                                                autheliaManager: {
                                                    ...prev.autheliaManager,
                                                    usersFile: e.target.value
                                                }
                                            } : null
                                    )
                            }
                            placeholder={'users_database.yml'}
                        />
                        <p className={'text-sm text-gray-500'}>Le fichier users_database.yml contenant les comptes.</p>
                    </div>
                </div>
                <div className={'w-fit'}>
                    <Button
                        startSlot={<IconDeviceFloppy size={20} />}
                        onClick={handleSaveConfig}
                    >
                        Enregistrer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Settings;