"use client";

import { useModal } from "@/contexts/ModalContext";
import { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  name: string;
  actionName: string;
  onAction?: () => void;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({
  name,
  actionName,
  onAction,
  onClose,
  className = "",
  children,
}: ModalProps) => {
  const { name: currentName, close } = useModal();
  const isOpen = currentName === name;

  const handleClose = () => {
    if (onClose) onClose();
    close();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-1/2 max-w-lg bg-white rounded-xl p-6 px-8 flex flex-col gap-4 ${className}`}
      >
        <div className="flex-1">{children}</div>
        <div className="flex justify-end gap-4 mt-4">
          {actionName && (
            <button
              onClick={onAction}
              className="btn btn-primary"
              type="button"
            >
              {actionName}
            </button>
          )}
          <button onClick={handleClose} className="btn" type="button">
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") || document.createElement("div")
  );
};

export default Modal;
