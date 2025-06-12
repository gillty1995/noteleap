"use client";

import Modal from "./ModalWithForm";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string; // e.g. session name
};

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} overlayClassName="rounded-2xl">
      <div className="bg-white rounded-2xl p-6 mx-auto py-5 max-w-xs shadow-lg">
        <h3 className="text-xl sharetech mb-4 text-center max-w-3xs">
          Delete "{itemName}"?
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to permanently delete this?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 
                bg-gradient-to-r from-gray-100/70 to-gray-200/70 
                text-gray-800 font-semibold 
                rounded-full 
                shadow-lg
                hover:from-gray-200/70 hover:to-gray-300/90 
                transition
                cursor-pointer
                hover:text-gray-900/70"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 
                bg-gradient-to-r from-red-100/70 to-red-200/70 
                text-red-800 font-semibold 
                rounded-full 
                shadow-lg
                hover:from-red-100/90 hover:to-red-200/90 
                transition
                cursor-pointer
                hover:text-red-900/70"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
