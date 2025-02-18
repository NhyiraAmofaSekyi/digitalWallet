import React, { useEffect } from "react";
import Button from "./button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionButtonText?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  actionButtonText = "Confirm",
  onAction,
  children,
}) => {
  // Close dialog on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        </div>

        {/* Dialog Content */}
        <div className="mb-6">{children}</div>

        {/* Dialog Actions */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-4 py-2"
    
          >
            Cancel
          </Button>
          <Button
            onClick={onAction}
            className="px-4 py-2"
        
          >
            {actionButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;