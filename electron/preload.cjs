const { contextBridge, ipcRenderer } = require("electron");

/**
 * Preload Script for Employee Management Demo
 * 
 * Secure Bridge: Exposes only narrowly-scoped methods to the React renderer.
 * Node integration is disabled and context isolation is enabled.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // App & Platform information
  isElectron: true,
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    app: "1.0.0",
  },

  // Employee Local Data Operations (Persistent storage in userData/employees.json)
  getEmployees: () => ipcRenderer.invoke("employees:getAll"),
  saveEmployees: (employees) => ipcRenderer.invoke("employees:saveAll", employees),
  resetDemoData: () => ipcRenderer.invoke("employees:resetDemo"),

  // Native Windows Printing & PDF Preview Integration
  printWindow: () => ipcRenderer.invoke("printer:printCurrentWindow"),
  getPrinters: () => ipcRenderer.invoke("printer:getPrinters"),
  printToDevice: (options) => ipcRenderer.invoke("printer:printToDevice", options),
  exportPDF: (filename) => ipcRenderer.invoke("printer:exportPDF", { filename }),
  previewInSystemViewer: (filename) =>
    ipcRenderer.invoke("printer:previewInSystemViewer", { filename }),

  // Native Desktop Notifications
  showNotification: (title, body) =>
    ipcRenderer.invoke("desktop:showNotification", { title, body }),

  // System Specs
  getSystemInfo: () => ipcRenderer.invoke("system:getInfo"),
});
