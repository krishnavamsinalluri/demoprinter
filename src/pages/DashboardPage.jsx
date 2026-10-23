import React from "react";
import StatCard from "../components/StatCard";
import EmployeeTable from "../components/EmployeeTable";
import {
  IconUsers,
  IconCheckCircle,
  IconAlertCircle,
  IconDollar,
  IconBuilding,
  IconUserPlus,
} from "../components/Icons";

export default function DashboardPage({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onPrintSlip,
}) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter((e) => e.status === "Inactive").length;

  const totalPayroll = employees.reduce(
    (sum, e) => sum + (Number(e.salary) || 0),
    0
  );
  const avgSalary =
    totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Department counts
  const deptCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || "General";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const deptColors = {
    Engineering: "#8b5cf6",
    "Human Resources": "#ec4899",
    Finance: "#10b981",
    Marketing: "#f97316",
    Product: "#06b6d4",
    Operations: "#eab308",
  };

  // Recent 5 employees
  const recentEmployees = [...employees].slice(0, 5);

  return (
    <div className="page-body">
      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard
          label="Total Employees"
          value={totalEmployees}
          subtext="Registered in company database"
          icon={IconUsers}
          iconColor="#3b82f6"
          iconBg="rgba(59, 130, 246, 0.15)"
        />
        <StatCard
          label="Active Staff"
          value={activeEmployees}
          subtext={`${totalEmployees ? Math.round((activeEmployees / totalEmployees) * 100) : 0}% workforce active`}
          icon={IconCheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.15)"
        />
        <StatCard
          label="Inactive Staff"
          value={inactiveEmployees}
          subtext="On leave or former employees"
          icon={IconAlertCircle}
          iconColor="#94a3b8"
          iconBg="rgba(148, 163, 184, 0.15)"
        />
        <StatCard
          label="Total Annual Payroll"
          value={formatCurrency(totalPayroll)}
          subtext={`Avg: ${formatCurrency(avgSalary)} / employee`}
          icon={IconDollar}
          iconColor="#ec4899"
          iconBg="rgba(236, 72, 153, 0.15)"
        />
      </div>

      {/* Main Grid: Recent Employees & Department Distribution */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Roster */}
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Recent Employee Roster</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                Quick view of the most recent employee records
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onAddEmployee}
            >
              <IconUserPlus size={14} />
              <span>Add</span>
            </button>
          </div>

          <EmployeeTable
            employees={recentEmployees}
            onEdit={onEditEmployee}
            onDelete={onDeleteEmployee}
            onPrintSlip={onPrintSlip}
          />
        </div>

        {/* Right Column: Department Breakdown */}
        <div className="card-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Department Distribution</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                Staff headcount allocation
              </div>
            </div>
            <IconBuilding size={18} color="var(--text-dim)" />
          </div>

          <div className="dept-bar-group">
            {Object.keys(deptCounts).map((dept) => {
              const count = deptCounts[dept];
              const pct = totalEmployees
                ? Math.round((count / totalEmployees) * 100)
                : 0;
              const color = deptColors[dept] || "#3b82f6";

              return (
                <div key={dept} className="dept-bar-item">
                  <div className="dept-bar-label">
                    <span>{dept}</span>
                    <span style={{ fontWeight: 600 }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="dept-progress-bg">
                    <div
                      className="dept-progress-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 16,
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text-dim)",
            }}
          >
            <span>Total Departments:</span>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {Object.keys(deptCounts).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
