import React, { useState, useMemo } from "react";
import EmployeeTable from "../components/EmployeeTable";
import { IconSearch, IconUserPlus, IconPrinter, IconFilter } from "../components/Icons";

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Product",
  "Operations",
];

export default function EmployeesPage({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onPrintSlip,
  onPrintDirectory,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search matching (name or ID)
      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        !term ||
        emp.name.toLowerCase().includes(term) ||
        emp.id.toLowerCase().includes(term) ||
        (emp.email && emp.email.toLowerCase().includes(term));

      // Department matching
      const matchDept =
        selectedDept === "All Departments" || emp.department === selectedDept;

      // Status matching
      const matchStatus =
        selectedStatus === "All Status" || emp.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, selectedDept, selectedStatus]);

  return (
    <div className="page-body">
      {/* Search and Filters Bar */}
      <div className="filter-bar no-print">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <IconSearch size={16} />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, employee ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IconFilter size={15} color="var(--text-dim)" />
            <select
              className="select-control"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <select
            className="select-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <button
            type="button"
            className="btn btn-outline"
            onClick={onPrintDirectory}
            title="Print entire filtered employee directory"
          >
            <IconPrinter size={16} />
            <span>Print List</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddEmployee}
          >
            <IconUserPlus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Results Count Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          padding: "0 4px",
          fontSize: 13,
          color: "var(--text-dim)",
        }}
      >
        <span>
          Showing{" "}
          <strong style={{ color: "var(--text-main)" }}>
            {filteredEmployees.length}
          </strong>{" "}
          of {employees.length} total employees
        </span>
        {(searchTerm || selectedDept !== "All Departments" || selectedStatus !== "All Status") && (
          <button
            type="button"
            style={{
              background: "none",
              color: "var(--primary)",
              fontSize: 12,
              textDecoration: "underline",
            }}
            onClick={() => {
              setSearchTerm("");
              setSelectedDept("All Departments");
              setSelectedStatus("All Status");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Table */}
      <EmployeeTable
        employees={filteredEmployees}
        onEdit={onEditEmployee}
        onDelete={onDeleteEmployee}
        onPrintSlip={onPrintSlip}
      />
    </div>
  );
}
