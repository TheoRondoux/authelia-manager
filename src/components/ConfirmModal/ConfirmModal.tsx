import React from "react";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    isConfirming?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    description,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    isConfirming = false,
    onConfirm,
    onClose,
}) => {
    const handleClose = () => {
        if (!isConfirming) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={'w-80 flex flex-col gap-4'}>
                <h2 className={'text-2xl font-semibold'}>{title}</h2>
                {description && <p className={'text-gray-500'}>{description}</p>}
                <div className={'flex justify-end gap-2'}>
                    <Button onClick={handleClose} variant={'secondary'} disabled={isConfirming}>
                        {cancelLabel}
                    </Button>
                    <Button onClick={onConfirm} variant={'danger'} disabled={isConfirming}>
                        {isConfirming ? <Loader size={20} /> : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
