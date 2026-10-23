import React from "react";
import {
  ExecutiveDossierView,
  ExecutiveDirectoryReportView,
} from "./ExecutivePrintViews";

export default function PrintDocument({
  printType, // 'slip' | 'directory'
  employee,
  employees = [],
}) {
  if (printType === "slip" && employee) {
    return (
      <div className="print-only">
        <ExecutiveDossierView employee={employee} />
      </div>
    );
  }

  return (
    <div className="print-only">
      <ExecutiveDirectoryReportView employees={employees} />
    </div>
  );
}
