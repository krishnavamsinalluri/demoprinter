import React from "react";
import { IconPrinter, IconFileText, IconBuilding, IconDollar } from "../components/Icons";

export default function ReportsPage({ employees, onPrintDirectory }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Department statistics
  const deptSummary = employees.reduce((acc, emp) => {
    const dept = emp.department || "General";
    if (!acc[dept]) {
      acc[dept] = { count: 0, active: 0, payroll: 0 };
    }
    acc[dept].count += 1;
    if (emp.status === "Active") acc[dept].active += 1;
    acc[dept].payroll += Number(emp.salary) || 0;
    return acc;
  }, {});

  const totalPayroll = employees.reduce(
    (sum, e) => sum + (Number(e.salary) || 0),
    0
  );

  return (
    <div className="page-body">
      {/* Top Banner Card */}
      <div
        className="card-panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(17, 24, 39, 0.9))",
          borderColor: "rgba(59, 130, 246, 0.2)",
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, color: "var(--text-main)", marginBottom: 4 }}>
            Official Corporate Print Center
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13, maxWidth: 600 }}>
            Generate and send official reports to installed Windows hardware
            printers or export to PDF via the native Windows print dialog.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onPrintDirectory}
        >
          <IconPrinter size={18} />
          <span>Print Complete Staff Directory</span>
        </button>
      </div>

      {/* Department Financial Summary Table */}
      <div className="card-panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">Department Budget & Headcount Summary</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
              Consolidated breakdown by functional division
            </div>
          </div>
          <IconBuilding size={18} color="var(--text-dim)" />
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Headcount</th>
                <th>Active Headcount</th>
                <th>Total Annual Payroll</th>
                <th>Average Salary</th>
                <th>Payroll Share</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(deptSummary).map((dept) => {
                const item = deptSummary[dept];
                const avg = item.count > 0 ? Math.round(item.payroll / item.count) : 0;
                const share = totalPayroll > 0 ? Math.round((item.payroll / totalPayroll) * 100) : 0;

                return (
                  <tr key={dept}>
                    <td style={{ fontWeight: 600 }}>{dept}</td>
                    <td>{item.count}</td>
                    <td>
                      <span className="status-pill active" style={{ fontSize: 11 }}>
                        <span className="status-pill-dot" />
                        {item.active} Active
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(item.payroll)}</td>
                    <td style={{ color: "var(--text-muted)" }}>{formatCurrency(avg)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "#1e293b",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${share}%`,
                              height: "100%",
                              background: "var(--primary)",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-dim)", minWidth: 28 }}>
                          {share}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Instructions / Client Demo Card */}
      <div
        className="card-panel"
        style={{
          borderLeft: "4px solid var(--primary)",
          background: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <IconFileText size={22} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-main)", marginBottom: 4 }}>
              Client Demonstration Note: Native Printing
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
              In this Electron Windows desktop build, clicking any print button invokes
              Electron's native <code>webContents.print()</code> handler. This triggers
              the actual Windows Printer Selection Dialog with support for physical
              printers, <em>Microsoft Print to PDF</em>, and custom page margins without
              any external print server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
