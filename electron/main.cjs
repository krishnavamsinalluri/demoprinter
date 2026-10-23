const { app, BrowserWindow, ipcMain, Notification, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Path to persistent data file in user's OS AppData directory
function getDataFilePath() {
  const userDataDir = app.getPath("userData");
  return path.join(userDataDir, "employees.json");
}

// Initial realistic seed data for demo demonstration
const SEED_EMPLOYEES = [
  {
    id: "EMP-1001",
    name: "Alex Morgan",
    email: "alex.morgan@company.local",
    department: "Engineering",
    designation: "Lead Software Architect",
    salary: 115000,
    status: "Active",
    joinedDate: "2022-03-15",
    phone: "+1 (555) 234-8901",
  },
  {
    id: "EMP-1002",
    name: "Sarah Jenkins",
    email: "sarah.j@company.local",
    department: "Human Resources",
    designation: "Senior HR Manager",
    salary: 88000,
    status: "Active",
    joinedDate: "2021-08-01",
    phone: "+1 (555) 456-1122",
  },
  {
    id: "EMP-1003",
    name: "David Kim",
    email: "david.kim@company.local",
    department: "Finance",
    designation: "Financial Controller",
    salary: 95000,
    status: "Active",
    joinedDate: "2023-01-10",
    phone: "+1 (555) 789-3344",
  },
  {
    id: "EMP-1004",
    name: "Elena Rostova",
    email: "elena.r@company.local",
    department: "Marketing",
    designation: "Digital Growth Specialist",
    salary: 76000,
    status: "Active",
    joinedDate: "2023-06-20",
    phone: "+1 (555) 901-5566",
  },
  {
    id: "EMP-1005",
    name: "Marcus Vance",
    email: "marcus.v@company.local",
    department: "Engineering",
    designation: "DevOps Engineer",
    salary: 98000,
    status: "Inactive",
    joinedDate: "2020-11-12",
    phone: "+1 (555) 123-7788",
  },
  {
    id: "EMP-1006",
    name: "Priya Patel",
    email: "priya.patel@company.local",
    department: "Product",
    designation: "Senior Product Designer",
    salary: 92000,
    status: "Active",
    joinedDate: "2022-09-05",
    phone: "+1 (555) 678-9900",
  },
];

// Helper to safely read employees from file
function readEmployeesFromFile() {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(filePath)) {
      // First time launch: initialize with seed data
      fs.writeFileSync(filePath, JSON.stringify(SEED_EMPLOYEES, null, 2), "utf-8");
      return SEED_EMPLOYEES;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : SEED_EMPLOYEES;
  } catch (err) {
    console.error("Error reading employees file:", err);
    return SEED_EMPLOYEES;
  }
}

// Helper to safely write employees to file
function writeEmployeesToFile(employees) {
  try {
    const filePath = getDataFilePath();
    const tempPath = `${filePath}.tmp`;
    // Write atomically via temporary file
    fs.writeFileSync(tempPath, JSON.stringify(employees, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
    return { success: true };
  } catch (err) {
    console.error("Error writing employees file:", err);
    return { success: false, error: err.message };
  }
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 650,
    title: "Employee Management Demo",
    backgroundColor: "#0b0f19",
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    mainWindow.loadURL("http://127.0.0.1:5173");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    // 1. Employee Data IPC Handlers
    ipcMain.handle("employees:getAll", async () => {
      return readEmployeesFromFile();
    });

    ipcMain.handle("employees:saveAll", async (event, employees) => {
      if (!Array.isArray(employees)) {
        return { success: false, error: "Invalid data payload, expected an array." };
      }
      return writeEmployeesToFile(employees);
    });

    ipcMain.handle("employees:resetDemo", async () => {
      writeEmployeesToFile(SEED_EMPLOYEES);
      return SEED_EMPLOYEES;
    });

    // 2. Native Windows Printing IPC Handler
    ipcMain.handle("printer:printCurrentWindow", async () => {
      if (!mainWindow) return { success: false, failureReason: "No active window" };

      return new Promise((resolve) => {
        mainWindow.webContents.print(
          {
            silent: false, // Opens native Windows printer selection dialog
            printBackground: true,
            color: true,
            margins: {
              marginType: "default",
            },
          },
          (success, failureReason) => {
            if (!success) {
              resolve({
                success: false,
                canceled: failureReason === "cancelled",
                failureReason: failureReason || "Print operation did not complete",
              });
            } else {
              resolve({ success: true });
            }
          }
        );
      });
    });

    // 2b. Get List of Installed Windows Printers
    ipcMain.handle("printer:getPrinters", async () => {
      if (!mainWindow) return [];
      try {
        const printers = await mainWindow.webContents.getPrintersAsync();
        return printers;
      } catch (err) {
        console.error("Error fetching printers:", err);
        return [];
      }
    });

    // 2c. Print Directly to a Specific Device
    ipcMain.handle("printer:printToDevice", async (event, { deviceName, silent = false }) => {
      if (!mainWindow) return { success: false, failureReason: "No active window" };

      return new Promise((resolve) => {
        mainWindow.webContents.print(
          {
            silent: Boolean(silent),
            deviceName: deviceName || undefined,
            printBackground: true,
            color: true,
            margins: { marginType: "default" },
          },
          (success, failureReason) => {
            if (!success) {
              resolve({
                success: false,
                canceled: failureReason === "cancelled",
                failureReason: failureReason || "Print failed",
              });
            } else {
              resolve({ success: true });
            }
          }
        );
      });
    });

    // 3. Export to PDF File
    ipcMain.handle("printer:exportPDF", async (event, { filename }) => {
      if (!mainWindow) return { success: false, error: "No active window" };
      try {
        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
          title: "Save Document as PDF",
          defaultPath: filename || "Employee_Directory_Report.pdf",
          filters: [{ name: "PDF Files", extensions: ["pdf"] }],
        });

        if (canceled || !filePath) return { success: false, canceled: true };

        const pdfBuffer = await mainWindow.webContents.printToPDF({
          pageSize: "A4",
          printBackground: true,
          landscape: false,
        });

        fs.writeFileSync(filePath, pdfBuffer);
        return { success: true, filePath };
      } catch (err) {
        console.error("PDF export error:", err);
        return { success: false, error: err.message };
      }
    });

    // 4. Open Generated PDF in System Viewer (Edge / Acrobat) for Full Print Preview
    ipcMain.handle("printer:previewInSystemViewer", async (event, { filename }) => {
      if (!mainWindow) return { success: false, error: "No active window" };
      try {
        const tempPath = path.join(
          app.getPath("temp"),
          filename || "Employee_Document_Preview.pdf"
        );
        const pdfBuffer = await mainWindow.webContents.printToPDF({
          pageSize: "A4",
          printBackground: true,
          landscape: false,
        });

        fs.writeFileSync(tempPath, pdfBuffer);
        await shell.openPath(tempPath);
        return { success: true, filePath: tempPath };
      } catch (err) {
        console.error("PDF preview error:", err);
        return { success: false, error: err.message };
      }
    });

    // 5. Desktop Notification IPC Handler
    ipcMain.handle("desktop:showNotification", async (event, { title, body }) => {
      if (Notification.isSupported()) {
        new Notification({
          title: title || "Employee Management Demo",
          body: body || "Operation completed successfully.",
        }).show();
        return { success: true };
      }
      return { success: false, reason: "Notifications not supported" };
    });

    // 6. System Info
    ipcMain.handle("system:getInfo", async () => {
      return {
        platform: os.platform(),
        arch: os.arch(),
        osRelease: os.release(),
        dataFilePath: getDataFilePath(),
        totalMemGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(1),
        freeMemGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(1),
      };
    });

    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
