import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { LuX } from "react-icons/lu";

const Modal = ({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the modal
      modalRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll
      document.body.style.overflow = "unset";

      // Restore focus to previously focused element
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-background rounded-lg shadow-xl w-full mx-4 sm:max-w-lg xl:max-w-xl max-h-[90vh] flex flex-col overflow-y-auto"
        tabIndex={-1}
      >
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2
              id="modal-title"
              className="text-lg sm:text-xl md:text-2xl font-bold text-primary"
            >
              {title}
            </h2>
            <span
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-1 text-xl sm:text-2xl md:text-3xl cursor-pointer"
            >
              <LuX />
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
