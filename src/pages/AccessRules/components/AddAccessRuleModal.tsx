import React, {useEffect} from "react";
import {Button, IconButton, Input, Loader, Modal} from "../../../components";
import {IconCheck, IconMinus, IconPlus, IconX} from "@tabler/icons-react";
import {createAccessRule} from "../../../api/authelia/access-rules.ts";

const POLICIES = ["bypass", "one_factor", "two_factor", "deny"];

interface AddAccessRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    updateAccessRuleList?: () => void;
}

export const AddAccessRuleModal: React.FC<AddAccessRuleModalProps> = ({isOpen, onClose, updateAccessRuleList}) => {
    const [domain, setDomain] = React.useState('');
    const [policy, setPolicy] = React.useState(POLICIES[0]);
    const [subjects, setSubjects] = React.useState<string[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);
    const [newSubject, setNewSubject] = React.useState('');
    const [isAddingSubject, setIsAddingSubject] = React.useState(false);

    const handleClose = () => {
        if (!isSaving) {
            onClose();
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        createAccessRule({
            domain,
            policy,
            ...(subjects.length > 0 ? {subject: subjects} : {}),
        }).then(() => {
            if (updateAccessRuleList) {
                updateAccessRuleList();
            }
            handleClose();
        }).finally(() => {
            setIsSaving(false);
        });
    };

    useEffect(() => {
        if (isOpen) {
            setDomain('');
            setPolicy(POLICIES[0]);
            setSubjects([]);
            setNewSubject('');
            setIsAddingSubject(false);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={'w-80'}>
                <div className={'flex flex-col gap-4'}>
                    <h2 className={'text-2xl font-semibold'}>Ajouter une règle d'accès</h2>
                    <Input label="Domaine" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="*.example.com" />
                    <div className={'flex flex-col gap-1'}>
                        <label className={'text-sm text-gray-600'}>Politique</label>
                        <select
                            value={policy}
                            onChange={(e) => setPolicy(e.target.value)}
                            className={'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-purple-800'}
                        >
                            {POLICIES.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className={'text-sm text-gray-600'}>Groupes</p>
                        <div className={'flex gap-2 items-end flex-wrap'}>
                            {subjects.map((subject, index) => (
                                <div key={index} className={'flex items-center gap-2 mt-2'}>
                                    <span className={'flex items-center gap-2 py-1 px-2 border border-gray-200 rounded-lg text-xs'}>
                                        {subject}
                                        <IconButton onClick={() => {
                                            setSubjects(subjects.filter((_, i) => i !== index));
                                        }} icon={<IconMinus size={12} />} variant="danger" />
                                    </span>
                                </div>
                            ))}
                            {!isAddingSubject && <IconButton onClick={() => setIsAddingSubject(true)} icon={<IconPlus size={20} />} variant="default" />}
                            {isAddingSubject && (
                                <div className={'flex gap-2 items-center'}>
                                    <Input
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        placeholder="admin"
                                        className={'w-20'}
                                        startSlot={"group:"}
                                    />
                                    <div className={'flex gap-2 mt-2'}>
                                        <IconButton onClick={() => {
                                            if (newSubject.trim() !== '') {
                                                setSubjects([...subjects, `group:${newSubject.trim()}`]);
                                                setNewSubject('');
                                                setIsAddingSubject(false);
                                            }
                                        }} icon={<IconCheck size={20} />} variant="default" />
                                        <IconButton onClick={() => {
                                            setNewSubject('');
                                            setIsAddingSubject(false);
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
