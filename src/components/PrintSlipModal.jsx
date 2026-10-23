import React from "react";
import { IconPrinter, IconX } from "./Icons";

export default function PrintSlipModal({
  isOpen,
  employee,
  onClose,
  onPrint,
}) {
  if (!isOpen || !employee) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: 650 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconPrinter size={20} color="var(--primary)" />
            <h2>Print Employee Details Slip</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ background: "#f8fafc" }}>
          {/* Printable Slip Card Preview */}
          <div className="print-slip-card" id="printable-employee-slip">
            <div className="slip-header">
              <div className="slip-company">
                <h2>ACME CORPORATION</h2>
                <p>Employee Record & Identification Slip</p>
              </div>
              <div className="slip-badge">
                <div className="slip-badge-label">Employee ID</div>
                <div className="slip-badge-id">{employee.id}</div>
              </div>
            </div>

            <div className="slip-grid">
              <div className="slip-field">
                <span className="slip-field-label">Full Legal Name</span>
                <span className="slip-field-value">{employee.name}</span>
              </div>
              <div className="slip-field">
                <span className="slip-field-label">Employment Status</span>
                <span className="slip-field-value">{employee.status}</span>
              </div>

              <div className="slip-field">
                <span className="slip-field-label">Department</span>
                <span className="slip-field-value">{employee.department}</span>
              </div>
              <div className="slip-field">
                <span className="slip-field-label">Designation / Role</span>
                <span className="slip-field-value">{employee.designation}</span>
              </div>

              <div className="slip-field">
                <span className="slip-field-label">Official Email</span>
                <span className="slip-field-value">{employee.email}</span>
              </div>
              <div className="slip-field">
                <span className="slip-field-label">Contact Phone</span>
                <span className="slip-field-value">
                  {employee.phone || "Not provided"}
                </span>
              </div>

              <div className="slip-field">
                <span className="slip-field-label">Base Salary</span>
                <span className="slip-field-value">
                  {formatCurrency(employee.salary)} / year
                </span>
              </div>
              <div className="slip-field">
                <span className="slip-field-label">Joining Date</span>
                <span className="slip-field-value">{employee.joinedDate}</span>
              </div>
            </div>

            <div className="slip-signatures">
              <div className="signature-box">Employee Signature</div>
              <div className="signature-box">Authorized HR Officer</div>
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
            className="btn btn-primary"
            onClick={onPrint}
          >
            <IconPrinter size={16} />
            <span>Open Windows Print Dialog</span>
          </button>
        </div>
      </div>
    </div>
  );
}
