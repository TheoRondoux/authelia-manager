import {useEffect, useState} from "react";
import type {AutheliaUser} from "../../api/types.ts";
import {getUsers} from "../../api/authelia/users.ts";
import {Input} from "../../components";
import {IconZoom} from "@tabler/icons-react";

const Users = () => {

    const [users, setUsers] = useState<AutheliaUser[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const fetchUsers = () => {
        getUsers().then((data) => {
            setUsers(data);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2 justify-center items-start'}>
                <h1 className={'text-4xl font-semibold'}>Utilisateurs</h1>
                <p className={'text-gray-500'}>Gérez les comptes et leurs appartenances aux groupes.</p>
            </div>
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                startSlot={<IconZoom size={20}/>}
                className={'max-w-1/2 xl:max-w-1/3 mt-2'}
            />
            <div className={'flex flex-col border border-gray-200 rounded-2xl shadow-md'}>
                {
                    users.filter((user) => user.displayname.toLowerCase().includes(searchValue.toLowerCase()) || user.username.toLowerCase().includes(searchValue.toLowerCase()) || user.email.toLowerCase().includes(searchValue.toLowerCase())).map((user) => (
                        <div key={user.username} className={'flex flex-col gap-3 not-last:border-b not-last:border-gray-200 p-4'}>
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
                    ))
                }
            </div>
        </div>
    );
}

export default Users;