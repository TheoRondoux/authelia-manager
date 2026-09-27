import React from "react";

interface DashboardCardProps {
    title: string;
    count: number | string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, onClick }) => {
    return (
        <button className={`bg-white border border-gray-200 shadow-md rounded-lg p-6 overflow-hidden transition-colors duration-300 ease-in-out ${onClick ? "hover:bg-gray-50 hover:cursor-pointer" : ""}`} onClick={onClick}>
            <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex flex-col w-3/4 items-start">
                    <span className="text-gray-500 whitespace-nowrap">{title}</span>
                    <span className="text-2xl font-bold">{count}</span>
                </div>
                <div className="text-primary text-3xl text-purple-900">
                    {icon}
                </div>
            </div>
        </button>
    );
};