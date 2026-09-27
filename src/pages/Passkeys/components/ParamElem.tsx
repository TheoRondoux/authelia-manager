import React from "react";

interface ParamElemProps {
    title: string;
    icon?: React.ReactNode;
    input?: React.ReactNode;
    description?: string;
}

export const ParamElem: React.FC<ParamElemProps> = ({ title, icon, input, description }) => {
    return (
        <div className={'flex flex-col gap-2'}>
            <div className={'flex items-center gap-2'}>
                {icon}
                <p className={'font-semibold'}>{title}</p>
            </div>
            {input}
            <p className={'text-sm text-gray-500'}>{description}</p>
        </div>
    )
}