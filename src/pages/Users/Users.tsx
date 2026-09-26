import {useEffect, useState} from "react";
import type {AutheliaUser} from "../../api/types.ts";
import {deleteUser, getUsers} from "../../api/authelia/users.ts";
import {Button, IconButton, Input} from "../../components";
import {IconEdit, IconPlus, IconTrash, IconZoom} from "@tabler/icons-react";
import {EditUserModal} from "./components/EditUserModal.tsx";
import {AddUserModal} from "./components/AddUserModal.tsx";

const Users = () => {

    const [users, setUsers] = useState<AutheliaUser[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<AutheliaUser | null>(null);

    const [openAddModal, setOpenAddModal] = useState<boolean>(false);

    const fetchUsers = () => {
        getUsers().then((data) => {
            setUsers(data);
        });
    };

    const handleDeleteUser = (user: AutheliaUser) => {
        deleteUser(user.username).then(() => {
            fetchUsers();
        });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <EditUserModal isOpen={openEditModal} onClose={() => setOpenEditModal(false)} user={selectedUser} updateUserList={fetchUsers} />
            <AddUserModal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} updateUserList={fetchUsers} />
            <div className={'flex flex-col gap-4'}>
                <div className={'flex flex-col gap-2 justify-center items-start'}>
                    <h1 className={'text-4xl font-semibold'}>Utilisateurs</h1>
                    <p className={'text-gray-500'}>Gérez les comptes et leurs appartenances aux groupes.</p>
                </div>
                <div className={'flex justify-between'}>
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Rechercher un utilisateur..."
                        startSlot={<IconZoom size={20}/>}
                    />
                    <div>
                        <Button
                            startSlot={<IconPlus size={24} />}
                            onClick={() => setOpenAddModal(true)}
                        >
                            Ajouter un utilisateur
                        </Button>
                    </div>
                </div>
                <div className={'flex flex-col border border-gray-200 rounded-2xl shadow-md'}>
                    {
                        users.filter((user) => user.displayname.toLowerCase().includes(searchValue.toLowerCase()) || user.username.toLowerCase().includes(searchValue.toLowerCase()) || user.email.toLowerCase().includes(searchValue.toLowerCase())).map((user) => (
                            <div key={user.username} className={'flex flex-col gap-3 not-last:border-b not-last:border-gray-200 p-4'}>
                                <div className={'flex items-center justify-between'}>
                                    <div className={'flex flex-col gap-3'}>
                                        <div className={'flex flex-col gap-px'}>
                                            <p className={'font-semibold'}>{user.displayname} <span className={'text-gray-500'}>({user.username})</span></p>
                                            <p className={'text-gray-500'}>{user.email}</p>
                                        </div>
                                        <div className={'flex gap-1'}>
                                            {user.groups.map((group => (
                                                <span key={group} className={'py-1 px-2 border border-gray-200 rounded-lg text-xs'}>{group}</span>
                                            )))}
                                        </div>
                                    </div>
                                    <div className={'flex items-center gap-2'}>
                                        <IconButton
                                            onClick={() => { setSelectedUser(user); setOpenEditModal(true); }}
                                            icon={<IconEdit size={20} />}
                                        />
                                        <IconButton
                                            onClick={() => handleDeleteUser(user)}
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

export default Users;