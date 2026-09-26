import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    startSlot?: React.ReactNode;
    endSlot?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, startSlot, endSlot, ...props }) => {
    return (
        <div className={`flex flex-col gap-1`}>
            {label && <label htmlFor={props.id} className="text-sm text-gray-600">{label}</label>}
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring focus-within:ring-purple-800">
                {startSlot && <div className="mr-2 text-gray-400">{startSlot}</div>}
                <input
                    {...props}
                    className={`flex-1 focus:outline-none ${props.className}`}
                />
                {endSlot && <div className="ml-2 text-gray-400">{endSlot}</div>}
            </div>
        </div>
    );
}

export default Input;