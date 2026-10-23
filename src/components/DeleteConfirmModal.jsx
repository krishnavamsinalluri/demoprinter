import React from "react";
import { IconAlertCircle, IconTrash } from "./Icons";

export default function DeleteConfirmModal({
  isOpen,
  employee,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconAlertCircle size={22} color="var(--danger)" />
            <h2>Confirm Deletion</h2>
          </div>
        </div>

        <div className="modal-body">
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
            Are you sure you want to delete this employee? This will permanently
            remove the record from your local Windows application database.
          </p>

          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {employee.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
              ID: {employee.id} • {employee.department} • {employee.designation}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(employee.id)}
          >
            <IconTrash size={16} />
            <span>Delete Employee</span>
          </button>
        </div>
      </div>
    </div>
  );
}
