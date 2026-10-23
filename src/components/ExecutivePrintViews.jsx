import React from "react";

export function formatCurrency(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(val || 0);
}

export function getInitials(name) {
  if (!name) return "EM";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Full-Page Executive Corporate Personnel Dossier
 */
export function ExecutiveDossierView({ employee }) {
  if (!employee) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const monthlySalary = (Number(employee.salary) || 0) / 12;
  const refCode = `REF-2026-${employee.id}`;

  return (
    <div className="executive-dossier">
      {/* Top Gradient Accent */}
      <div className="dossier-top-accent" />

      {/* Header Letterhead */}
      <div className="dossier-header">
        <div className="dossier-brand">
          <div className="brand-crest">AG</div>
          <div className="brand-names">
            <h1>Acme Global Enterprises</h1>
            <p>Human Resources & Corporate Personnel Directorate</p>
          </div>
        </div>

        <div className="dossier-meta">
          <div>
            Document Ref: <span className="dossier-ref">{refCode}</span>
          </div>
          <div>Issue Date: {currentDate}</div>
          <div className="dossier-verified-badge">
            ✓ VERIFIED PERSONNEL DOSSIER
          </div>
        </div>
      </div>

      {/* Hero Identification Block */}
      <div className="dossier-hero">
        <div className="hero-identity">
          <div className="hero-avatar">{getInitials(employee.name)}</div>
          <div className="hero-details">
            <h2>{employee.name}</h2>
            <div className="hero-designation">{employee.designation}</div>
            <div className="hero-pills">
              <span className="pill-id">{employee.id}</span>
              <span className="pill-dept">{employee.department} Division</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background:
                    employee.status === "Active" ? "#ecfdf5" : "#f1f5f9",
                  color:
                    employee.status === "Active" ? "#047857" : "#64748b",
                  border:
                    employee.status === "Active"
                      ? "1px solid #a7f3d0"
                      : "1px solid #cbd5e1",
                }}
              >
                ● {employee.status} Staff
              </span>
            </div>
          </div>
        </div>

        <div className="hero-barcode">
          <div className="barcode-lines">
            <span className="bar" style={{ width: 3 }} />
            <span className="bar" style={{ width: 1 }} />
            <span className="bar" style={{ width: 4 }} />
            <span className="bar" style={{ width: 2 }} />
            <span className="bar" style={{ width: 5 }} />
            <span className="bar" style={{ width: 1 }} />
            <span className="bar" style={{ width: 3 }} />
            <span className="bar" style={{ width: 2 }} />
            <span className="bar" style={{ width: 4 }} />
            <span className="bar" style={{ width: 2 }} />
            <span className="bar" style={{ width: 6 }} />
            <span className="bar" style={{ width: 1 }} />
            <span className="bar" style={{ width: 3 }} />
            <span className="bar" style={{ width: 4 }} />
            <span className="bar" style={{ width: 2 }} />
            <span className="bar" style={{ width: 5 }} />
            <span className="bar" style={{ width: 2 }} />
            <span className="bar" style={{ width: 4 }} />
            <span className="bar" style={{ width: 1 }} />
            <span className="bar" style={{ width: 3 }} />
          </div>
          <span className="barcode-text">*{employee.id}*</span>
        </div>
      </div>

      {/* Section 1: Employment Particulars */}
      <div className="dossier-section">
        <div className="section-heading">
          <span>01. Employment Particulars & Organizational Role</span>
        </div>
        <div className="section-grid">
          <div className="info-tile">
            <div className="info-tile-label">Primary Department</div>
            <div className="info-tile-value">{employee.department}</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Official Designation</div>
            <div className="info-tile-value">{employee.designation}</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Hire / Join Date</div>
            <div className="info-tile-value">{employee.joinedDate}</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Work Location</div>
            <div className="info-tile-value">Corporate HQ - Floor 4</div>
          </div>
        </div>
      </div>

      {/* Section 2: Compensation & Payroll Profile */}
      <div className="dossier-section">
        <div className="section-heading">
          <span>02. Compensation & Authorized Payroll Profile</span>
        </div>
        <div className="section-grid">
          <div className="info-tile highlight">
            <div className="info-tile-label">Base Annual Salary</div>
            <div className="info-tile-value currency">
              {formatCurrency(employee.salary)}
            </div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Monthly Gross Equivalent</div>
            <div className="info-tile-value">
              {formatCurrency(monthlySalary)}
            </div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Pay Frequency</div>
            <div className="info-tile-value">Bi-Weekly Direct Deposit</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Classification</div>
            <div className="info-tile-value">Exempt • Full-Time</div>
          </div>
        </div>
      </div>

      {/* Section 3: Contact & Administrative Record */}
      <div className="dossier-section">
        <div className="section-heading">
          <span>03. Contact & Administrative Telemetry</span>
        </div>
        <div className="section-grid">
          <div className="info-tile" style={{ gridColumn: "span 2" }}>
            <div className="info-tile-label">Corporate Email Address</div>
            <div className="info-tile-value" style={{ color: "#1e40af" }}>
              {employee.email}
            </div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Official Telephone</div>
            <div className="info-tile-value">
              {employee.phone || "+1 (555) 000-0000"}
            </div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">System Security Access</div>
            <div className="info-tile-value">Level 3 Enterprise</div>
          </div>
        </div>
      </div>

      {/* Attestation Notice */}
      <div className="dossier-attestation">
        <strong>OFFICIAL CERTIFICATION NOTICE:</strong> The employment particulars,
        active assignment, and compensation profile stated in this dossier have been verified
        against the master enterprise personnel records. This document serves as official proof
        of employment when duly executed by the authorized signatory below.
      </div>

      {/* Signatures & Corporate Seal */}
      <div className="dossier-signatures">
        <div className="sig-block">
          <div className="sig-line">
            <div className="sig-name">{employee.name}</div>
            <div className="sig-title">Employee Signature / Acknowledgment</div>
          </div>
        </div>

        <div className="corporate-seal">
          <div style={{ fontSize: "14px", marginBottom: "2px" }}>★</div>
          <div>ACME GLOBAL</div>
          <div>OFFICIAL SEAL</div>
          <div style={{ fontSize: "8px", marginTop: "2px" }}>HUMAN RESOURCES</div>
        </div>

        <div className="sig-block">
          <div className="sig-line">
            <div className="sig-name">Marcus Vance, VP of HR</div>
            <div className="sig-title">Authorized Corporate Officer</div>
          </div>
        </div>
      </div>

      {/* Document Footer */}
      <div className="dossier-footer">
        <span>
          Security Audit Hash: SHA256:{employee.id}-{refCode}
        </span>
        <span>Confidential Personnel Record • Page 1 of 1</span>
      </div>
    </div>
  );
}

/**
 * Full-Page Executive Staff Directory Report
 */
export function ExecutiveDirectoryReportView({ employees = [] }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalPayroll = employees.reduce(
    (sum, e) => sum + (Number(e.salary) || 0),
    0
  );
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const avgSalary =
    employees.length > 0 ? Math.round(totalPayroll / employees.length) : 0;

  return (
    <div className="directory-report">
      {/* Header */}
      <div className="report-header">
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "#0f172a" }}>
            ACME GLOBAL ENTERPRISES
          </h1>
          <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600, marginTop: "2px" }}>
            Comprehensive Employee Directory & Personnel Disbursement Roster
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px", color: "#64748b" }}>
          <div>Date Generated: <strong>{currentDate}</strong></div>
          <div>Classification: <strong>Corporate Confidential</strong></div>
        </div>
      </div>

      {/* Executive KPI Summary Bar */}
      <div className="report-kpi-bar">
        <div className="report-kpi">
          <div className="report-kpi-label">Total Headcount</div>
          <div className="report-kpi-value">{employees.length} Staff</div>
        </div>
        <div className="report-kpi">
          <div className="report-kpi-label">Active vs Inactive</div>
          <div className="report-kpi-value" style={{ color: "#059669" }}>
            {activeCount} Active / {employees.length - activeCount} Inactive
          </div>
        </div>
        <div className="report-kpi">
          <div className="report-kpi-label">Total Annual Payroll</div>
          <div className="report-kpi-value">{formatCurrency(totalPayroll)}</div>
        </div>
        <div className="report-kpi">
          <div className="report-kpi-label">Average Staff Compensation</div>
          <div className="report-kpi-value">{formatCurrency(avgSalary)}</div>
        </div>
      </div>

      {/* Formatted Data Table */}
      <table className="report-table">
        <thead>
          <tr>
            <th style={{ width: "12%" }}>Emp ID</th>
            <th style={{ width: "20%" }}>Full Name</th>
            <th style={{ width: "22%" }}>Corporate Email</th>
            <th style={{ width: "16%" }}>Department</th>
            <th style={{ width: "16%" }}>Designation</th>
            <th style={{ width: "14%", textAlign: "right" }}>Annual Base</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td style={{ fontWeight: 700, fontFamily: "monospace", color: "#1e3a8a" }}>
                {emp.id}
              </td>
              <td style={{ fontWeight: 600 }}>{emp.name}</td>
              <td style={{ color: "#475569", fontSize: "9pt" }}>{emp.email}</td>
              <td>
                <span
                  style={{
                    background: "#e2e8f0",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "8.5pt",
                    fontWeight: 600,
                  }}
                >
                  {emp.department}
                </span>
              </td>
              <td style={{ color: "#334155" }}>{emp.designation}</td>
              <td style={{ textAlign: "right", fontWeight: 700, color: "#0f172a" }}>
                {formatCurrency(emp.salary)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Summary & Sign-off */}
      <div
        style={{
          marginTop: "30px",
          borderTop: "2px solid #0f172a",
          paddingTop: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10pt",
          color: "#64748b",
        }}
      >
        <div>
          Verified By: <strong>Director of Human Resources</strong>
        </div>
        <div>
          System Audit Stamp: <strong>HRMS-SECURE-EXPORT-OK</strong>
        </div>
        <div>Page 1 of 1</div>
      </div>
    </div>
  );
}
