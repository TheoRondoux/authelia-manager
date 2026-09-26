import React from "react";

interface IconButtonProps {
    onClick: () => void;
    variant?: 'default' | 'danger';
    icon?: React.ReactNode;
    disabled?: boolean;
}

const IconButton = ({ onClick, variant = 'default', icon, disabled = false }: IconButtonProps) => {

    let variantStyle = '';
    switch (variant) {
        case 'default':
            variantStyle = 'text-gray-400 hover:text-black hover:bg-gray-100';
            break;
        case 'danger':
            variantStyle = 'text-gray-400 hover:text-red-700 hover:bg-red-50';
            break;
    }

    return (
        <button
            onClick={() => onClick()}
            className={`text-sm rounded-lg p-2 ${variantStyle} transition-colors ease-in-out duration-300 hover:cursor-pointer size-fit`}
            disabled={disabled}
        >
            {icon}
        </button>
    )
};

export default IconButton;