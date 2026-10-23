import React, { useState, useEffect } from "react";
import {
  IconDashboard,
  IconUsers,
  IconPrinter,
  IconBriefcase,
  IconRefresh,
} from "./Icons";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onResetDemo,
  isElectron,
}) {
  const [sysInfo, setSysInfo] = useState(null);

  useEffect(() => {
    if (isElectron && window.electronAPI?.getSystemInfo) {
      window.electronAPI.getSystemInfo().then((info) => {
        setSysInfo(info);
      });
    }
  }, [isElectron]);

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <IconBriefcase size={22} />
          </div>
          <div>
            <div className="brand-title">Employee Pro</div>
            <div className="brand-subtitle">Desktop Edition</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <IconDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            <IconUsers size={18} />
            <span>Employee Directory</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <IconPrinter size={18} />
            <span>Reports & Printing</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="system-status">
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {isElectron ? "Windows Desktop App" : "Web Preview Mode"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
              {isElectron ? `Local DB • ${sysInfo?.platform || "win32"}` : "Local Storage"}
            </div>
          </div>
          <div className="status-dot" title="Active & Local" />
        </div>

        <button
          type="button"
          className="btn-reset-demo"
          onClick={onResetDemo}
          title="Restore factory demo employee dataset"
        >
          <IconRefresh size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
}
