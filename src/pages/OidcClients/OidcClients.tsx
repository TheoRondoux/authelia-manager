import type {OidcClient} from "../../api/types.ts";
import {useEffect, useState} from "react";
import {deleteOidcClient, getOidcClients} from "../../api/authelia/oidc.ts";
import {Button, ConfirmModal, IconButton, Input, Tag} from "../../components";
import {IconEdit, IconPlus, IconTrash, IconZoom} from "@tabler/icons-react";
import {OidcClientModal} from "./components/OidcClientModal.tsx";

const OidcClients = () => {

    const [oidcClients, setOidcClients] = useState<OidcClient[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<OidcClient | null>(null);
    const [clientToDelete, setClientToDelete] = useState<OidcClient | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOidcClients = () => {
        getOidcClients().then((data) => {
            setOidcClients(data);
            setError(null);
        }).catch((reason: unknown) => {
            setError(reason instanceof Error ? reason.message : "Impossible de charger les clients OIDC");
        });
    }

    const handleConfirmDelete = () => {
        if (!clientToDelete) {
            return;
        }

        setIsDeleting(true);
        deleteOidcClient(clientToDelete.client_id).then(() => {
            fetchOidcClients();
            setClientToDelete(null);
        }).catch((reason: unknown) => {
            setError(reason instanceof Error ? reason.message : "Impossible de supprimer le client OIDC");
        }).finally(() => {
            setIsDeleting(false);
        });
    };

    useEffect(() => {
        fetchOidcClients();
    }, []);

    return (
        <>
            <OidcClientModal
                isOpen={isAddModalOpen || selectedClient !== null}
                client={selectedClient}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setSelectedClient(null);
                }}
                onSaved={fetchOidcClients}
            />
            <ConfirmModal
                isOpen={clientToDelete !== null}
                title="Supprimer le client OIDC"
                description={<>Voulez-vous vraiment supprimer le client « {clientToDelete?.client_name} » ? Cette action est irréversible.</>}
                confirmLabel="Supprimer"
                isConfirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onClose={() => setClientToDelete(null)}
            />
            <div className={'flex flex-col gap-4'}>
                <div className={'flex flex-col gap-2 justify-center items-start'}>
                    <h1 className={'text-4xl font-semibold'}>Clients OIDC</h1>
                    <p className={'text-gray-500'}>Gérez les clients OpenID Connect (OIDC) pour l'authentification et l'autorisation.</p>
                </div>
                <div className={'flex flex-col md:flex-row gap-2 justify-between'}>
                    <Input
                        className={'w-full md:w-50'}
                        startSlot={<IconZoom size={20}/>}
                        value={searchTerm}
                        placeholder={'Rechercher un client OIDC...'}
                        onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            setSearchTerm(searchTerm);
                        }}
                    />
                    <div className={'w-fit'}>
                        <Button
                            startSlot={<IconPlus size={24} />}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Ajouter un client
                        </Button>
                    </div>
                </div>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <div className={'flex flex-col border border-gray-200 rounded-2xl shadow-md'}>
                    {oidcClients
                        .filter((client) => client.client_name.toLowerCase().includes(searchTerm) || client.client_id.toLowerCase().includes(searchTerm))
                        .map((client) => (
                            <div key={client.client_id} className={'flex flex-col p-4 not-last:border-b border-gray-200 gap-1'}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <h2 className={'flex flex-wrap gap-1 items-center text-lg font-semibold'}>{client.client_name} <span className={'text-gray-500'}>({client.client_id})</span></h2>
                                        <p className={'text-gray-500'}>Politique : {client.authorization_policy}</p>
                                        <div className={'flex gap-1 items-center flex-wrap'}>
                                            <p className={'text-gray-500 break-all'}>{client.redirect_uris[0]}</p>
                                            {client.redirect_uris.length > 1 && <Tag text={`+${client.redirect_uris.length - 1}`} variant="secondary" />}
                                        </div>
                                        <div className={'flex gap-1 items-center flex-wrap pt-1'}>
                                            {client.scopes.map((scope, index) => (
                                                <Tag text={scope} variant="secondary" key={index} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <IconButton
                                            onClick={() => setSelectedClient(client)}
                                            icon={<IconEdit size={20} />}
                                            disabled={isDeleting && clientToDelete?.client_id === client.client_id}
                                        />
                                        <IconButton
                                            onClick={() => setClientToDelete(client)}
                                            icon={<IconTrash size={20} />}
                                            variant="danger"
                                            disabled={isDeleting && clientToDelete?.client_id === client.client_id}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    {oidcClients.length === 0 && !error && (
                        <p className="p-4 text-gray-500">Aucun client OIDC configuré.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default OidcClients;