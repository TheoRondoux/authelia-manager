import {Outlet, useLocation} from "react-router";
import {
    IconFingerprint,
    IconLayoutDashboard,
    IconShieldCheck,
    IconUsers,
} from "@tabler/icons-react";
import {SidebarLink} from "./components/SidebarLink.tsx";

export const WithSidebar = () => {

    const location = useLocation();

    return (
        <div className={'flex h-screen'}>
            <section className={'flex flex-col w-1/6 p-6 bg-gray-50 gap-6 border-r border-gray-200'}>
                <div className={'flex items-center gap-2 w-full'}>
                    <div className={'p-2 rounded-xl bg-purple-800 text-white w-fit h-fit'}>
                        <IconFingerprint size={24} />
                    </div>
                    <div>
                        <p className={'font-semibold text-xl'}>Authelia Manager</p>
                        <p className={'text-gray-500 text-sm'}>Manage Authelia settings</p>
                    </div>
                </div>
                <div className={'grid grid-cols-1 gap-2 w-full'}>
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
                </div>
            </section>
            <section className={'flex-1 px-8 xl:px-60 py-10'}>
                <Outlet />
            </section>
        </div>
    )
}