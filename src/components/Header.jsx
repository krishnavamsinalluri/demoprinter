import React from "react";
import { IconUserPlus, IconPrinter } from "./Icons";

export default function Header({
  title,
  subtitle,
  onAddEmployee,
  onQuickPrint,
}) {
  return (
    <header className="top-header no-print">
      <div className="header-title-group">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-actions">
        {onQuickPrint && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onQuickPrint}
            title="Open Windows Print Dialog"
          >
            <IconPrinter size={16} />
            <span>Print View</span>
          </button>
        )}

        {onAddEmployee && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddEmployee}
          >
            <IconUserPlus size={16} />
            <span>Add Employee</span>
          </button>
        )}
      </div>
    </header>
  );
}
