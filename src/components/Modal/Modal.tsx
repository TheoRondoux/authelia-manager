import React, {useEffect, useState} from "react";
import {IconX} from "@tabler/icons-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onOpen, children }) => {
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen && onOpen) {
            onOpen();
        }
    }, [isOpen, onOpen]);

    useEffect(() => {
        let firstAnimationFrame: number | undefined;
        let secondAnimationFrame: number | undefined;
        let timeout: ReturnType<typeof setTimeout> | undefined;

        if (isOpen) {
            setIsMounted(true);
            firstAnimationFrame = window.requestAnimationFrame(() => {
                secondAnimationFrame = window.requestAnimationFrame(() => setIsVisible(true));
            });
        } else {
            setIsVisible(false);
            timeout = window.setTimeout(() => setIsMounted(false), 300);
        }

        return () => {
            if (firstAnimationFrame !== undefined) {
                window.cancelAnimationFrame(firstAnimationFrame);
            }
            if (secondAnimationFrame !== undefined) {
                window.cancelAnimationFrame(secondAnimationFrame);
            }
            if (timeout !== undefined) {
                window.clearTimeout(timeout);
            }
        };
    }, [isOpen]);

    if (!isMounted) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 transition-opacity ease-in-out duration-300 ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <div className={`bg-white rounded-lg shadow-lg p-6 relative transition-all ease-in-out duration-300 ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"}`}>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-colors ease-in-out duration-300"
                    onClick={onClose}
                >
                    <IconX size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;