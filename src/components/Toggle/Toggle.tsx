import React from "react";

interface ToggleProps {
    title?: string
    isOn?: boolean;
    onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ title, isOn = false, onToggle }) => {
    return (
        <div className={'flex items-center'}>
            {title && <span className={'mr-2'}>{title} </span>}
            <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 ${isOn ? 'bg-purple-800' : 'bg-gray-300'} hover:cursor-pointer transition-colors duration-300 ease-in-out`}>
                <span className={`transform transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 bg-white rounded-full`}></span>
            </button>
        </div>
    );
}
export default Toggle;