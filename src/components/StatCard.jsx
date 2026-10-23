import React from "react";

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "#3b82f6",
  iconBg = "rgba(59, 130, 246, 0.12)",
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <div
          className="stat-icon-wrapper"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {Icon && <Icon size={18} />}
        </div>
      </div>
      <div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
