import React from "react";

interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'danger-outline' | 'success-outline';
    startSlot?: React.ReactNode;
    endSlot?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({onClick = () => {}, disabled = false, children, variant = 'primary', startSlot, endSlot}: ButtonProps) => {

    let variantStyle = '';
    switch (variant) {
        case 'primary':
            variantStyle = 'bg-black text-white hover:bg-gray-700 disabled:hover:bg-black';
            break;
        case 'secondary':
            variantStyle = 'border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:hover:bg-gray-200 disabled:hover:bg-transparent';
            break;
        case 'danger':
            variantStyle = 'bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600';
            break;
        case 'success':
            variantStyle = 'bg-green-600 text-white hover:bg-green-700 disabled:hover:bg-green-600';
            break;
        case 'danger-outline':
            variantStyle = 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:hover:bg-transparent disabled:hover:text-red-600';
            break;
        case 'success-outline':
            variantStyle = 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white disabled:hover:bg-transparent disabled:hover:text-green-600';
            break;
    }

    return (
        <button
            className={`w-full flex flex-row items-center justify-center gap-2 ${variantStyle} py-2 px-4 rounded-lg hover:cursor-pointer transition-colors ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={onClick}
            disabled={disabled}
        >
            {startSlot && <span>{startSlot}</span>}
            {children}
            {endSlot && <span>{endSlot}</span>}
        </button>
    )
}

export default Button;