import React, { useEffect } from "react";
import { IconCheckCircle, IconAlertCircle, IconX } from "./Icons";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="toast-container no-print">
      <div className={`toast ${isSuccess ? "success" : "error"}`}>
        {isSuccess ? (
          <IconCheckCircle size={20} color="var(--success)" />
        ) : (
          <IconAlertCircle size={20} color="var(--danger)" />
        )}
        <div style={{ flex: 1 }}>{toast.message}</div>
        <button
          type="button"
          className="btn-icon"
          onClick={onClose}
          style={{ padding: 4 }}
        >
          <IconX size={14} />
        </button>
      </div>
    </div>
  );
}
