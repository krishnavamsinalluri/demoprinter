import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import ReportsPage from "./pages/ReportsPage";
import EmployeeModal from "./components/EmployeeModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import PrintPreviewModal from "./components/PrintPreviewModal";
import PrintDocument from "./components/PrintDocument";
import Toast from "./components/Toast";
import { storageService } from "./services/storageService";
import { printService } from "./services/printService";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'employees' | 'reports'
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState("add"); // 'add' | 'edit'
  const [activeEmployee, setActiveEmployee] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Print Preview Modal State
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [previewDocType, setPreviewDocType] = useState("directory"); // 'directory' | 'slip'
  const [selectedPreviewEmployee, setSelectedPreviewEmployee] = useState(null);

  // Target data formatted for physical printer output (@media print)
  const [activePrintType, setActivePrintType] = useState("directory");
  const [employeeToPrint, setEmployeeToPrint] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  const isElectron = storageService.isElectron();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Notify via Electron native OS notification if available
  const triggerNotification = (title, body) => {
    if (isElectron && window.electronAPI?.showNotification) {
      window.electronAPI.showNotification(title, body);
    }
  };

  // Load employee data from local storage
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);
      showToast("Failed to load employee records from storage.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setActiveEmployee(null);
    setFormModalMode("add");
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (employee) => {
    setActiveEmployee(employee);
    setFormModalMode("edit");
    setIsFormModalOpen(true);
  };

  // Submit Add or Edit
  const handleFormSubmit = async (formData) => {
    try {
      if (formModalMode === "add") {
        const created = await storageService.addEmployee(formData);
        setEmployees((prev) => [created, ...prev]);
        setIsFormModalOpen(false);
        showToast(`Employee ${created.name} (${created.id}) added successfully!`);
        triggerNotification("Employee Created", `${created.name} was added to the local database.`);
      } else {
        const updated = await storageService.updateEmployee(formData.id, formData);
        setEmployees((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
        setIsFormModalOpen(false);
        showToast(`Employee ${updated.name} updated successfully!`);
        triggerNotification("Employee Updated", `Changes saved for ${updated.name}.`);
      }
    } catch (err) {
      showToast(err.message || "An error occurred while saving.", "error");
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async (id) => {
    try {
      await storageService.deleteEmployee(id);
      const deletedName = employeeToDelete?.name || id;
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      showToast(`Employee record for ${deletedName} deleted.`);
      triggerNotification("Employee Deleted", `Removed record for ${deletedName}.`);
    } catch (err) {
      showToast(err.message || "Failed to delete record.", "error");
    }
  };

  // Reset demo seed data
  const handleResetDemoData = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset demo records? Any custom additions will be replaced with initial sample staff data."
      )
    ) {
      try {
        const fresh = await storageService.resetDemoData();
        setEmployees(fresh);
        showToast("Demo employee dataset restored.");
      } catch (err) {
        showToast("Failed to reset demo data.", "error");
      }
    }
  };

  // Open Interactive Print Preview Modal
  const handleOpenPrintPreview = (docType = "directory", employee = null) => {
    setPreviewDocType(docType);
    const targetEmp = employee || (employees.length > 0 ? employees[0] : null);
    setSelectedPreviewEmployee(targetEmp);
    setActivePrintType(docType);
    setEmployeeToPrint(targetEmp);
    setIsPrintPreviewOpen(true);
  };

  // Trigger Native Windows Print Dialog or Direct Device Print
  const handlePrintWindowsDialog = async (docType, employee, targetDevice = "") => {
    setActivePrintType(docType);
    setEmployeeToPrint(employee);
    // Allow state change to register in DOM before print dialog takes over
    setTimeout(async () => {
      const result = targetDevice
        ? await printService.printToDevice(targetDevice, false)
        : await printService.triggerPrint();

      if (result.canceled) {
        showToast("Print was cancelled by user.", "error");
      } else if (result.success) {
        showToast(`Document dispatched to ${targetDevice || "Windows printer"}!`);
      } else {
        showToast(result.error || result.failureReason || "Failed to print.", "error");
      }
    }, 150);
  };

  // Export as Real PDF File
  const handleExportPDF = async (docType, employee) => {
    setActivePrintType(docType);
    setEmployeeToPrint(employee);
    const sanitizedName = employee ? employee.name.replace(/[^a-zA-Z0-9]/g, "_") : "Staff";
    const filename =
      docType === "slip"
        ? `Employee_Slip_${sanitizedName}.pdf`
        : "Employee_Staff_Directory.pdf";

    setTimeout(async () => {
      const result = await printService.exportPDF(filename);
      if (result.canceled) {
        showToast("PDF export was cancelled.", "error");
      } else if (result.success) {
        showToast(`PDF saved successfully: ${result.filePath}`);
      } else {
        showToast(result.error || "Failed to export PDF.", "error");
      }
    }, 150);
  };

  // Open in Windows System PDF Viewer (e.g. Edge with full print preview)
  const handleOpenSystemViewer = async (docType, employee) => {
    setActivePrintType(docType);
    setEmployeeToPrint(employee);
    const filename =
      docType === "slip"
        ? `Employee_Slip_Preview.pdf`
        : "Employee_Directory_Preview.pdf";

    setTimeout(async () => {
      const result = await printService.openSystemPreview(filename);
      if (result.success) {
        showToast("Opened vector PDF preview in Windows Default Viewer!");
      } else {
        showToast(result.error || "Failed to open preview.", "error");
      }
    }, 150);
  };

  // Determine active header title and subtitle
  const getHeaderInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Dashboard Overview",
          subtitle: "Real-time employee counts, department breakdown, and payroll metrics",
        };
      case "employees":
        return {
          title: "Employee Management",
          subtitle: "Search, filter, update records, and generate identification slips",
        };
      case "reports":
        return {
          title: "Reports & Printing",
          subtitle: "Generate official company reports and hardware print documents",
        };
      default:
        return { title: "Employee Management", subtitle: "" };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemoData}
        isElectron={isElectron}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onAddEmployee={handleOpenAddModal}
          onQuickPrint={() => handleOpenPrintPreview("directory")}
        />

        {isLoading ? (
          <div className="page-body">
            <div className="empty-state">
              <h3>Loading employee database...</h3>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <DashboardPage
                employees={employees}
                onAddEmployee={handleOpenAddModal}
                onEditEmployee={handleOpenEditModal}
                onDeleteEmployee={handleOpenDeleteModal}
                onPrintSlip={(emp) => handleOpenPrintPreview("slip", emp)}
              />
            )}

            {activeTab === "employees" && (
              <EmployeesPage
                employees={employees}
                onAddEmployee={handleOpenAddModal}
                onEditEmployee={handleOpenEditModal}
                onDeleteEmployee={handleOpenDeleteModal}
                onPrintSlip={(emp) => handleOpenPrintPreview("slip", emp)}
                onPrintDirectory={() => handleOpenPrintPreview("directory")}
              />
            )}

            {activeTab === "reports" && (
              <ReportsPage
                employees={employees}
                onPrintDirectory={() => handleOpenPrintPreview("directory")}
              />
            )}
          </>
        )}
      </main>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isFormModalOpen}
        mode={formModalMode}
        initialData={activeEmployee}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employee={employeeToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Interactive Print Preview & Layout Inspector Modal */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        initialDocType={previewDocType}
        employees={employees}
        selectedEmployee={selectedPreviewEmployee}
        onClose={() => setIsPrintPreviewOpen(false)}
        onPrintWindowsDialog={handlePrintWindowsDialog}
        onExportPDF={handleExportPDF}
        onOpenSystemViewer={handleOpenSystemViewer}
      />

      {/* Hidden container formatted specifically for physical printer output (@media print) */}
      <PrintDocument
        printType={activePrintType}
        employee={employeeToPrint}
        employees={employees}
      />

      {/* Toast Alert Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
