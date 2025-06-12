"use client";

import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative text-black">
        {" "}
        <div className="relative bg-transparent">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3.5 text-black hover:text-gray-600 z-99 cursor-pointer trannsition ease-in-out hover:scale-115 hover:animate-spin hover:[animation-iteration-count:1]"
            aria-label="Close"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
