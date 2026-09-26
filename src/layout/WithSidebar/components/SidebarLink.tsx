import * as React from "react";
import {Link} from "react-router";

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ href, label, icon, isActive = false }) => {
    return (
        <Link to={href} className={`flex items-center h-fit gap-2 px-4 py-2 rounded-md transition-colors ease-in-out duration-300 ${isActive ? 'bg-purple-800/10 text-purple-900 font-semibold' : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'}`}>
            <span>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}