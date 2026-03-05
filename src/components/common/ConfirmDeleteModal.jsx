import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm font-page-title ">
      <div className="max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold   text-slate-800">
            {title}
          </h3>
        </div>
        <p className="mb-6 text-gray-600 text-center">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border-2 border-gray-300 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-500 py-2 font-semibold text-white transition-colors hover:bg-red-600 cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}