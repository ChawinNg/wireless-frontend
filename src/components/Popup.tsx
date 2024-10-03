// components/Modal.tsx
import { FC } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="flex flex-row items-center justify-center gap-x-4 text-red-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
