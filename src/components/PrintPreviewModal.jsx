import React, { useState, useEffect } from "react";
import {
  IconPrinter,
  IconDownload,
  IconEye,
  IconX,
  IconFileText,
  IconUsers,
} from "./Icons";
import { printService } from "../services/printService";
import {
  ExecutiveDossierView,
  ExecutiveDirectoryReportView,
} from "./ExecutivePrintViews";

export default function PrintPreviewModal({
  isOpen,
  initialDocType = "directory", // 'directory' | 'slip'
  employees = [],
  selectedEmployee = null,
  onClose,
  onPrintWindowsDialog,
  onExportPDF,
  onOpenSystemViewer,
}) {
  const [docType, setDocType] = useState(initialDocType);
  const [activeEmpId, setActiveEmpId] = useState(
    selectedEmployee?.id || (employees.length > 0 ? employees[0].id : "")
  );
  const [printers, setPrinters] = useState([]);
  const [targetDevice, setTargetDevice] = useState("");

  useEffect(() => {
    if (isOpen) {
      printService.getPrinters().then((list) => {
        setPrinters(list);
        if (list.length > 0) {
          const def = list.find((p) => p.isDefault) || list[0];
          setTargetDevice(def.name);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEmployee =
    employees.find((e) => e.id === activeEmpId) ||
    selectedEmployee ||
    employees[0];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 60 }}>
      <div
        className="modal-dialog"
        style={{
          maxWidth: 960,
          width: "95vw",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Modal Top Control Bar */}
        <div
          className="modal-header"
          style={{
            background: "#111827",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "var(--primary-glow)",
                color: "#60a5fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconEye size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, margin: 0, color: "var(--text-main)" }}>
                Print Preview & Layout Inspector
              </h2>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                Executive Personnel Dossier • A4 Vector Print View
              </div>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onOpenSystemViewer(docType, currentEmployee)}
              title="Open real PDF in Microsoft Edge / System Viewer with full print preview"
            >
              <IconEye size={14} />
              <span>Open in Windows Viewer</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onExportPDF(docType, currentEmployee)}
              title="Save clean PDF document to disk"
            >
              <IconDownload size={14} />
              <span>Save as PDF</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                onPrintWindowsDialog(docType, currentEmployee, targetDevice)
              }
              title="Open Windows Print Dialog"
            >
              <IconPrinter size={14} />
              <span>Print Document</span>
            </button>

            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              aria-label="Close"
              style={{ marginLeft: 6 }}
            >
              <IconX size={18} />
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Document Selector */}
        <div
          style={{
            padding: "10px 24px",
            background: "rgba(15, 23, 42, 0.6)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
              Document Type:
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                className={`btn btn-sm ${
                  docType === "directory" ? "btn-primary" : "btn-outline"
                }`}
                style={{ padding: "4px 12px", fontSize: 12 }}
                onClick={() => setDocType("directory")}
              >
                <IconUsers size={13} />
                <span>Full Staff Directory</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  docType === "slip" ? "btn-primary" : "btn-outline"
                }`}
                style={{ padding: "4px 12px", fontSize: 12 }}
                onClick={() => setDocType("slip")}
              >
                <IconFileText size={13} />
                <span>Executive Personnel Dossier</span>
              </button>
            </div>
          </div>

          {docType === "slip" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
                Select Employee:
              </span>
              <select
                className="select-control"
                value={activeEmpId}
                onChange={(e) => setActiveEmpId(e.target.value)}
                style={{ padding: "5px 10px", fontSize: 12 }}
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.id} — {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            style={{
              fontSize: 11,
              color: "#34d399",
              background: "rgba(16, 185, 129, 0.1)",
              padding: "4px 10px",
              borderRadius: 12,
              border: "1px solid rgba(16, 185, 129, 0.25)",
            }}
          >
            ● A4 Portrait • Printable Viewport
          </div>
        </div>

        {/* Modal Body: Authentic White A4 Paper Sheet Preview */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#0a0d14",
            padding: "36px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Simulated A4 Paper Sheet */}
          <div
            style={{
              width: "100%",
              maxWidth: 780,
              background: "#ffffff",
              color: "#0f172a",
              padding: "32px 36px",
              borderRadius: 6,
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.65)",
              border: "1px solid #e2e8f0",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {docType === "directory" ? (
              <ExecutiveDirectoryReportView employees={employees} />
            ) : (
              <ExecutiveDossierView employee={currentEmployee} />
            )}
          </div>

          {/* Educational Note about the Windows Print Dialog */}
          <div
            style={{
              maxWidth: 780,
              width: "100%",
              marginTop: 20,
              background: "rgba(30, 41, 59, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              padding: "12px 18px",
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "#60a5fa", fontWeight: 600 }}>
              💡 Executive Print Formatting:
            </span>{" "}
            This personnel document is formatted with full corporate letterhead, security barcodes, compensation breakdown tiles, and authorized HR seal for executive presentation and physical paper printing.
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            padding: "14px 24px",
            background: "#111827",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
              Target Printer:
            </span>
            <select
              className="select-control"
              value={targetDevice}
              onChange={(e) => setTargetDevice(e.target.value)}
              style={{ fontSize: 12, padding: "6px 12px", minWidth: 240 }}
            >
              {printers.length === 0 ? (
                <>
                  <option value="">Default Windows Printer</option>
                  <option value="Microsoft Print to PDF">
                    Microsoft Print to PDF (Test)
                  </option>
                </>
              ) : (
                printers.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} {p.isDefault ? "★ (Default)" : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Close Preview
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                onPrintWindowsDialog(docType, currentEmployee, targetDevice)
              }
            >
              <IconPrinter size={16} />
              <span>Send to Windows Printer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
