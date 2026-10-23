# Employee Management Demo (React + Electron Desktop Application)

A standalone Windows desktop application built with **React**, **Vite**, **Electron**, and **Electron Builder**. Designed for client demonstrations and offline enterprise deployment without any external backend, API, or database server requirements.

---

## 1. Architecture Overview

The application follows the Electron security best practices recommended by the Electron core team:

```
┌────────────────────────────────────────────────────────┐
│           React 19 Renderer (Vite Frontend)            │
│  - Dashboard & Statistics                              │
│  - Employee Directory (CRUD, Search, Filters)          │
│  - Native Print Dialog Trigger                         │
└──────────────────────────┬─────────────────────────────┘
                           │ (Safe window.electronAPI calls)
                           ▼
┌────────────────────────────────────────────────────────┐
│             Preload Script (preload.cjs)               │
│  - contextIsolation: true                              │
│  - nodeIntegration: false                              │
│  - Strict, narrow IPC bridges (contextBridge)          │
└──────────────────────────┬─────────────────────────────┘
                           │ (ipcRenderer.invoke)
                           ▼
┌────────────────────────────────────────────────────────┐
│             Main Process (main.cjs)                    │
│  - Native Windows Window (1280x850)                    │
│  - Persistent JSON Storage (%APPDATA%/employees.json)  │
│  - Native Windows Print Handler (webContents.print)    │
│  - Native Desktop OS Notifications                     │
│  - System Hardware Telemetry                           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Project Folder Structure

```
react-electron-demo/
├── electron/
│   ├── main.cjs               # Electron main process (lifecycle, IPC handlers, storage, printing)
│   └── preload.cjs            # Secure contextBridge exposing window.electronAPI
├── src/
│   ├── components/
│   │   ├── DeleteConfirmModal.jsx # Delete confirmation dialog
│   │   ├── EmployeeModal.jsx      # Add / Edit employee form with input validation
│   │   ├── EmployeeTable.jsx      # Data table with status pills and actions
│   │   ├── Header.jsx             # Top bar with title and action buttons
│   │   ├── Icons.jsx              # Zero-dependency SVG icon collection
│   │   ├── PrintDocument.jsx      # Print-only formatted template for paper output
│   │   ├── PrintSlipModal.jsx     # Preview modal for employee ID slip
│   │   ├── Sidebar.jsx            # Desktop navigation & system status badge
│   │   ├── StatCard.jsx           # Dashboard metric card
│   │   └── Toast.jsx              # Operation feedback toasts
│   ├── pages/
│   │   ├── DashboardPage.jsx      # Dashboard metrics & department allocation
│   │   ├── EmployeesPage.jsx      # Search, filter, and table directory
│   │   └── ReportsPage.jsx        # Department payroll summary and print actions
│   ├── services/
│   │   ├── printService.js        # Printer interaction abstraction
│   │   └── storageService.js      # IPC storage with browser fallback
│   ├── styles/
│   │   ├── components.css         # UI cards, modals, table, and form styling
│   │   ├── index.css              # Reset, typography, and dark theme design tokens
│   │   └── print.css              # @media print rules for physical printers & PDF
│   ├── App.jsx                    # Root state coordinator
│   ├── index.css                  # Style bundler import
│   └── main.jsx                   # React entry point
├── dist/                          # Production Vite bundle (created via npm run build)
├── release/                       # Windows NSIS installer output folder (created via electron-builder)
├── index.html                     # HTML template
├── package.json                   # Dependencies, scripts, and Electron Builder configuration
└── vite.config.js                 # Vite config (configured with base: './' for Electron file:// compatibility)
```

---

## 3. Installation & Setup

Ensure **Node.js** (v18 or higher) is installed on your Windows system.

### Install Dependencies
Open PowerShell or Command Prompt in the project folder and run:
```bash
npm install
```

---

## 4. Running in Development Mode

Run the following command to start Vite and launch the Electron desktop window concurrently:

```bash
npm run electron:dev
```

### What happens behind the scenes:
1. `vite --host 127.0.0.1` launches the local dev server on port `5173`.
2. `wait-on http://127.0.0.1:5173` waits until the server is ready.
3. `electron .` opens the native Windows application window with Hot Module Replacement (HMR).

---

## 5. Building the Windows `.exe` Installer

To compile the React bundle and build the standalone Windows installer:

```bash
npm run electron:build
```

### Where is the generated installer located?
Once the build completes, the executable will be generated inside the `release/` directory:
- **Location**: `react-electron-demo\release\Employee Management Demo-Setup-1.0.0.exe`

### Installing and Running:
1. Double-click `Employee Management Demo-Setup-1.0.0.exe`.
2. The NSIS setup wizard will prompt you to select an installation folder and create desktop & start menu shortcuts.
3. The installed application will launch as a standalone desktop window without requiring Node, npm, or an open terminal.

---

## 6. How Local Data Storage Works

- **Zero Backend / Offline Operation**: The app does not connect to any remote server or cloud database.
- **Persistent Location**: When running in Electron, data is saved to a persistent JSON file in the Windows user profile:
  ```
  %APPDATA%\Employee Management Demo\employees.json
  ```
- **First Launch**: Automatically initializes with 6 realistic employee records across Engineering, HR, Finance, Marketing, and Product.
- **Atomic Writes**: Employee updates write to a temporary file before renaming, protecting against file corruption.
- **Reset Option**: Clicking **Reset Demo Data** in the sidebar restores factory sample data at any time during client demonstrations.

---

## 7. How Printing Works

- **Native Windows Printer Dialog**: The application utilizes Electron's `webContents.print({ silent: false })` via `src/services/printService.js`.
- **Printer Selection**: The native Windows print dialog displays all installed physical printers, network printers, and **Microsoft Print to PDF**.
- **Print Types**:
  1. **Individual Employee Slip**: Click the print icon on any employee row to preview and print an official ID/payroll slip with company header and signature boxes.
  2. **Full Employee Directory**: Click **Print List** or visit the **Reports & Printing** tab to print the full table formatted for A4 portrait paper.
- **CSS Formatting**: `@media print` rules in `src/styles/print.css` automatically strip out dark backgrounds, sidebars, headers, and buttons, ensuring crisp black-and-white printing suitable for paper.

---

## 8. Verification & Testing Checklist

1. **Dashboard Verification**:
   - Total Employees, Active Staff, Inactive Staff, and Payroll cards reflect current records.
   - Department Distribution bars recalculate percentages dynamically.
2. **Add Employee**:
   - Click **Add Employee**.
   - Test field validation (e.g., enter an invalid email or negative salary).
   - Enter valid details and submit. Note the confirmation toast and desktop notification.
3. **Search & Filter**:
   - Search by name (e.g., "Alex") or ID (e.g., "EMP-1002").
   - Filter by Department (e.g., "Engineering") or Status ("Active Only").
4. **Edit Employee**:
   - Click the pencil icon on any employee, change the designation or salary, and save.
5. **Delete Confirmation**:
   - Click the trash icon. Confirm that the confirmation modal appears before record removal.
6. **Printing**:
   - Click the printer icon on an employee row -> Click **Open Windows Print Dialog**.
   - Verify the print dialog opens and allows selecting a printer or "Microsoft Print to PDF".
   - Test cancelling the print dialog: verify the app gracefully displays "Print job was cancelled." without crashing.

---

## 9. Troubleshooting Common Errors

### 1. Blank White Screen in Packaged App
- **Cause**: Assets were referenced as absolute paths (`/assets/...`) instead of relative paths (`./assets/...`).
- **Fix**: Already configured in `vite.config.js` with `base: './'`.

### 2. Port 5173 Already in Use
- **Cause**: Another Vite instance or dev server is using port 5173.
- **Fix**: Stop existing background tasks or run:
  ```powershell
  Get-Process node -ErrorAction SilentlyContinue | Stop-Process
  ```

### 3. Windows SmartScreen Warning on Installer
- **Cause**: The generated `.exe` is self-packaged and not signed with an expensive commercial EV Code Signing Certificate.
- **Fix**: Click **More info** -> **Run anyway**. For commercial enterprise distribution, configure signing certificates in the `win` block of `package.json`.
