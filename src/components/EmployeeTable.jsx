import React from "react";
import { IconEdit, IconTrash, IconPrinter, IconUsers } from "./Icons";

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  onPrintSlip,
}) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getInitials = (name) => {
    if (!name) return "EM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconUsers size={40} />
          </div>
          <h3>No Employees Found</h3>
          <p>No employee records matched your active search query or filter selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>ID</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const deptClass = emp.department
              ? emp.department.replace(/\s+/g, "-")
              : "General";
            const isActive = emp.status === "Active";

            return (
              <tr key={emp.id}>
                <td>
                  <div className="emp-name-cell">
                    <div className="emp-avatar">{getInitials(emp.name)}</div>
                    <div>
                      <div className="emp-meta-name">{emp.name}</div>
                      <div className="emp-meta-email">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="emp-id-badge">{emp.id}</span>
                </td>
                <td>
                  <span className={`badge-dept ${deptClass}`}>
                    {emp.department}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{emp.designation}</td>
                <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                  {formatCurrency(emp.salary)}
                </td>
                <td>
                  <span className={`status-pill ${isActive ? "active" : "inactive"}`}>
                    <span className="status-pill-dot" />
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Print Employee Slip"
                      onClick={() => onPrintSlip(emp)}
                    >
                      <IconPrinter size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Edit Details"
                      onClick={() => onEdit(emp)}
                    >
                      <IconEdit size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon delete"
                      title="Delete Record"
                      onClick={() => onDelete(emp)}
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
