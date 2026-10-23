import React, { useState, useEffect } from "react";
import { IconX, IconUserPlus, IconEdit } from "./Icons";

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Product",
  "Operations",
];

export default function EmployeeModal({
  isOpen,
  mode = "add", // 'add' | 'edit'
  initialData = null,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "Engineering",
    designation: "",
    salary: "",
    status: "Active",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        id: initialData.id || "",
        name: initialData.name || "",
        email: initialData.email || "",
        department: initialData.department || "Engineering",
        designation: initialData.designation || "",
        salary: initialData.salary || "",
        status: initialData.status || "Active",
        phone: initialData.phone || "",
      });
    } else {
      // Auto-suggest next employee ID for demo convenience
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        id: `EMP-${randNum}`,
        name: "",
        email: "",
        department: "Engineering",
        designation: "",
        salary: "75000",
        status: "Active",
        phone: "",
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    if (!formData.id.trim()) {
      errs.id = "Employee ID is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email format.";
    }

    if (!formData.designation.trim()) {
      errs.designation = "Job designation is required.";
    }

    const salaryNum = Number(formData.salary);
    if (!formData.salary || isNaN(salaryNum) || salaryNum <= 0) {
      errs.salary = "Salary must be a positive number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      salary: Number(formData.salary),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode === "add" ? (
              <IconUserPlus size={20} color="var(--primary)" />
            ) : (
              <IconEdit size={20} color="var(--primary)" />
            )}
            <h2>{mode === "add" ? "Add New Employee" : "Edit Employee Details"}</h2>
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Employee ID */}
              <div className="form-group">
                <label htmlFor="emp-id">Employee ID *</label>
                <input
                  id="emp-id"
                  type="text"
                  placeholder="e.g. EMP-1010"
                  value={formData.id}
                  disabled={mode === "edit"}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  style={
                    mode === "edit"
                      ? { opacity: 0.6, cursor: "not-allowed" }
                      : {}
                  }
                />
                {errors.id && <span className="error-text">{errors.id}</span>}
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="emp-name">Full Name *</label>
                <input
                  id="emp-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group col-span-2">
                <label htmlFor="emp-email">Email Address *</label>
                <input
                  id="emp-email"
                  type="email"
                  placeholder="e.g. john.doe@company.local"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label htmlFor="emp-dept">Department *</label>
                <select
                  id="emp-dept"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div className="form-group">
                <label htmlFor="emp-desig">Designation *</label>
                <input
                  id="emp-desig"
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
                {errors.designation && (
                  <span className="error-text">{errors.designation}</span>
                )}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label htmlFor="emp-salary">Annual Salary (USD) *</label>
                <input
                  id="emp-salary"
                  type="number"
                  min="1"
                  step="1000"
                  placeholder="e.g. 85000"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                />
                {errors.salary && (
                  <span className="error-text">{errors.salary}</span>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="emp-status">Employment Status</label>
                <select
                  id="emp-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Contact Phone */}
              <div className="form-group col-span-2">
                <label htmlFor="emp-phone">Phone Number (Optional)</label>
                <input
                  id="emp-phone"
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
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
            <button type="submit" className="btn btn-primary">
              {mode === "add" ? "Save Employee" : "Update Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
