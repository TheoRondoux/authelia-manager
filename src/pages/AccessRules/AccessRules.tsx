import type {AccessRule} from "../../api/types.ts";
import {useEffect, useState} from "react";
import {deleteAccessRule, getAccessRules} from "../../api/authelia/access-rules.ts";
import {Button, IconButton, Input, Tag} from "../../components";
import {IconEdit, IconPlus, IconTrash, IconZoom} from "@tabler/icons-react";
import {EditAccessRuleModal} from "./components/EditAccessRuleModal.tsx";
import {AddAccessRuleModal} from "./components/AddAccessRuleModal.tsx";

const AccessRules = () => {
    const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [selectedRule, setSelectedRule] = useState<AccessRule | null>(null);
    const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(null);

    const [openAddModal, setOpenAddModal] = useState<boolean>(false);

    const fetchAccessRules = () => {
        getAccessRules().then((data) => {
            setAccessRules(data);
        });
    };

    const handleDeleteAccessRule = (index: number) => {
        deleteAccessRule(index).then(() => {
            fetchAccessRules();
        });
    }

    useEffect(() => {
        fetchAccessRules();
    }, []);

    return (
        <>
            <EditAccessRuleModal isOpen={openEditModal} onClose={() => setOpenEditModal(false)} rule={selectedRule} ruleIndex={selectedRuleIndex} updateAccessRuleList={fetchAccessRules} />
            <AddAccessRuleModal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} updateAccessRuleList={fetchAccessRules} />
            <div className={'flex flex-col gap-4'}>
                <div className={'flex flex-col gap-2 justify-center items-start'}>
                    <h1 className={'text-4xl font-semibold'}>Règles d'accès</h1>
                    <p className={'text-gray-500'}>Définissez quelle politique d'authentification s'applique à quel groupe sur quel site.</p>
                </div>
                <div className={'flex flex-col md:flex-row gap-2 justify-between'}>
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Rechercher une règle..."
                        startSlot={<IconZoom size={20}/>}
                    />
                    <div>
                        <Button
                            startSlot={<IconPlus size={24} />}
                            onClick={() => setOpenAddModal(true)}
                        >
                            Ajouter une règle
                        </Button>
                    </div>
                </div>
                <div className={'flex flex-col border border-gray-200 rounded-2xl shadow-md'}>
                    {
                        accessRules
                            .map((rule, index) => ({rule, index}))
                            .filter(({rule}) => rule.domain.toLowerCase().includes(searchValue.toLowerCase()) || rule.policy.toLowerCase().includes(searchValue.toLowerCase()))
                            .map(({rule, index}) => (
                                <div key={index} className={'flex flex-col gap-3 not-last:border-b not-last:border-gray-200 p-4'}>
                                    <div className={'flex items-center justify-between'}>
                                        <div className={'flex flex-col gap-3'}>
                                            <div className={'flex flex-col gap-px'}>
                                                <p className={'font-semibold'}>{rule.domain}</p>
                                                <p className={'text-gray-500'}>Politique: {rule.policy}</p>
                                            </div>
                                            <div className={'flex gap-1'}>
                                                {rule.subject?.map((item, subIndex) => (
                                                    <Tag key={subIndex} text={item} variant={'secondary'} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className={'flex items-center gap-2'}>
                                            <IconButton
                                                onClick={() => { setSelectedRule(rule); setSelectedRuleIndex(index); setOpenEditModal(true); }}
                                                icon={<IconEdit size={20} />}
                                            />
                                            <IconButton
                                                onClick={() => handleDeleteAccessRule(index)}
                                                icon={<IconTrash size={20} />} variant={'danger'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </>
    );
}

export default AccessRules;