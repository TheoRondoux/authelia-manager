import {Outlet, useLocation} from "react-router";
import {
    IconCheck,
    IconFingerprint,
    IconLayoutDashboard, IconRefresh, IconSettings,
    IconShieldCheck,
    IconUsers, IconX,
} from "@tabler/icons-react";
import {SidebarLink} from "./components/SidebarLink.tsx";
import {Button} from "../../components";
import {useState} from "react";
import {reloadAuthelia} from "../../api/authelia/authelia.ts";

export const WithSidebar = () => {


    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshState, setRefreshState] = useState<'success' | 'error' | null>(null);

    const handleRefresh = () => {
        setIsRefreshing(true);
        reloadAuthelia()
            .then(() => {
                setRefreshState('success');
            })
            .catch(() => {
                setRefreshState('error');
            })
            .finally(() => {
            setIsRefreshing(false);
            setTimeout(() => {
                setRefreshState(null);
            }, 3000);
        });
    };

    const location = useLocation();

    return (
        <div className={'flex h-screen'}>
            <section className={'flex flex-col w-1/6 bg-gray-50 gap-6 border-r border-gray-200'}>
                <div className={'flex items-center gap-2 w-full pt-6 px-6'}>
                    <div className={'p-2 rounded-xl bg-purple-800 text-white w-fit h-fit'}>
                        <IconFingerprint size={24} />
                    </div>
                    <div>
                        <p className={'font-semibold text-xl'}>Authelia Manager</p>
                        <p className={'text-gray-500 text-sm'}>Manage Authelia settings</p>
                    </div>
                </div>
                <div className={'flex flex-col gap-2 w-full flex-1 px-6'}>
                    <SidebarLink
                        href={'/'}
                        label={'Tableau de bord'}
                        icon={<IconLayoutDashboard size={24} />}
                        isActive={location.pathname === '/'}
                    />
                    <SidebarLink
                        href={'/users'}
                        label={'Utilisateurs'}
                        icon={<IconUsers size={24} />}
                        isActive={location.pathname === '/users'}
                    />
                    <SidebarLink
                        href={'/access-rules'}
                        label={'Règles d\'accès'}
                        icon={<IconShieldCheck size={24} />}
                        isActive={location.pathname === '/access-rules'}
                    />
                    <SidebarLink
                        href={'/settings'}
                        label={'Paramètres'}
                        icon={<IconSettings size={24} />}
                        isActive={location.pathname === '/settings'}
                    />
                </div>
                <div className={'flex items-center w-full border-t border-gray-200 p-6'}>
                    <Button
                        variant={refreshState === 'success' ? 'success-outline' : refreshState === 'error' ? 'danger-outline' : 'secondary'}
                        startSlot={refreshState === null && <IconRefresh className={`-scale-x-100 ${isRefreshing && 'animate-spin-reverse'}`} size={20} />}
                        endSlot={refreshState === 'success' ? <IconCheck size={20} /> : refreshState === 'error' ? <IconX size={20} /> : null}
                        onClick={handleRefresh}
                        disabled={isRefreshing || refreshState !== null}
                    >
                        Sync configuration
                    </Button>
                </div>
            </section>
            <section className={'flex-1 px-8 xl:px-60 py-10'}>
                <Outlet />
            </section>
        </div>
    )
}