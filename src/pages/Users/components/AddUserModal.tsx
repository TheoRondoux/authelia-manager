import React, {useEffect} from "react";
import {Button, IconButton, Input, Loader, Modal} from "../../../components";
import {IconCheck, IconMinus, IconPlus, IconX} from "@tabler/icons-react";
import {createUser} from "../../../api/authelia/users.ts";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    updateUserList?: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({isOpen, onClose, updateUserList}) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [displayname, setDisplayname] = React.useState('');
    const [groups, setGroups] = React.useState<string[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);
    const [newGroup, setNewGroup] = React.useState('');
    const [isAddingGroup, setIsAddingGroup] = React.useState(false);

    const handleClose = () => {
        if (!isSaving) {
            onClose();
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        createUser({
            username,
            password,
            email,
            displayname,
            groups
        }).then(() => {
            if (updateUserList) {
                updateUserList();
            }
            handleClose();
        }).finally(() => {
            setIsSaving(false);
        });
    };

    useEffect(() => {
        if (isOpen) {
            setUsername('');
            setPassword('');
            setEmail('');
            setDisplayname('');
            setGroups([]);
            setNewGroup('');
            setIsAddingGroup(false);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={'w-80'}>
                <div className={'flex flex-col gap-4'}>
                    <h2 className={'text-2xl font-semibold'}>Ajouter un utilisateur</h2>
                    <Input label="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input label="Nom affiché" value={displayname} onChange={(e) => setDisplayname(e.target.value)} />
                    <div>
                        <p className={'text-sm text-gray-600'}>Groupes</p>
                        <div className={'flex gap-2 items-end flex-wrap'}>
                            {groups.map((group, index) => (
                                <div key={index} className={'flex items-center gap-2 mt-2'}>
                                    <span className={'flex items-center gap-2 py-1 px-2 border border-gray-200 rounded-lg text-xs'}>
                                        {group}
                                        <IconButton onClick={() => {
                                            setGroups(groups.filter((_, i) => i !== index));
                                        }} icon={<IconMinus size={12} />} variant="danger" />
                                    </span>
                                </div>
                            ))}
                            {!isAddingGroup && <IconButton onClick={() => setIsAddingGroup(true)} icon={<IconPlus size={20} />} variant="default" />}
                            {isAddingGroup && (
                                <div className={'flex gap-2 items-center'}>
                                    <Input
                                        value={newGroup}
                                        onChange={(e) => setNewGroup(e.target.value)}
                                        placeholder="Nom du groupe"
                                        className={'mt-2'}
                                    />
                                    <div className={'flex gap-2 mt-2'}>
                                        <IconButton onClick={() => {
                                            if (newGroup.trim() !== '') {
                                                setGroups([...groups, newGroup.trim()]);
                                                setNewGroup('');
                                                setIsAddingGroup(false);
                                            }
                                        }} icon={<IconCheck size={20} />} variant="default" />
                                        <IconButton onClick={() => {
                                            setNewGroup('');
                                            setIsAddingGroup(false);
                                        }} icon={<IconX size={20} />} variant="danger" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={'flex justify-end gap-2 pt-4'}>
                    <Button
                        onClick={handleClose}
                        variant={'secondary'}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader size={20} /> : "Enregistrer"}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}