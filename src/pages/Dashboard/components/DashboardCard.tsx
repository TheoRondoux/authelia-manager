import React from "react";

interface DashboardCardProps {
    title: string;
    count: number | string;
    icon: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon }) => {
    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 overflow-hidden">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col w-3/4">
                    <span className="text-gray-500 whitespace-nowrap">{title}</span>
                    <span className="text-2xl font-bold">{count}</span>
                </div>
                <div className="text-primary text-3xl w-1/4">
                    {icon}
                </div>
            </div>
        </div>
    );
};