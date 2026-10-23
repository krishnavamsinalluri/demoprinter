/**
 * Dedicated Printing Service
 * 
 * Isolates all printer interactions from React components.
 * Invokes native Windows printer dialog via Electron IPC, generates real PDF exports,
 * and opens system-native preview viewers.
 */

export const printService = {
  /**
   * Check if running in Electron desktop mode
   */
  isElectron: () => {
    return typeof window !== "undefined" && Boolean(window.electronAPI?.isElectron);
  },

  /**
   * Trigger native Windows print dialog
   * @returns {Promise<{success: boolean, canceled: boolean, error?: string}>}
   */
  async triggerPrint() {
    try {
      if (this.isElectron() && typeof window.electronAPI.printWindow === "function") {
        const result = await window.electronAPI.printWindow();
        if (result.canceled) {
          return { success: false, canceled: true, message: "Print was cancelled." };
        }
        if (!result.success) {
          return {
            success: false,
            canceled: false,
            error: result.failureReason || "Failed to communicate with printer.",
          };
        }
        return { success: true, canceled: false };
      }

      // Browser fallback
      window.print();
      return { success: true, canceled: false };
    } catch (err) {
      console.error("Print service error:", err);
      return {
        success: false,
        canceled: false,
        error: err.message || "An unexpected error occurred while printing.",
      };
    }
  },

  /**
   * Export the document directly as a PDF file
   * @param {string} filename Default filename for save dialog
   */
  async exportPDF(filename = "Employee_Document.pdf") {
    try {
      if (this.isElectron() && typeof window.electronAPI.exportPDF === "function") {
        const result = await window.electronAPI.exportPDF(filename);
        return result;
      }
      return { success: false, error: "PDF export is only available in Desktop mode." };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Open the rendered document in the Windows Default PDF Viewer (Edge / Acrobat)
   * This provides 100% full print preview, page zoom, and native printing capabilities.
   * @param {string} filename
   */
  async openSystemPreview(filename = "Employee_Document_Preview.pdf") {
    try {
      if (
        this.isElectron() &&
        typeof window.electronAPI.previewInSystemViewer === "function"
      ) {
        const result = await window.electronAPI.previewInSystemViewer(filename);
        return result;
      }
      // Browser fallback: trigger window.print
      window.print();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Get all installed Windows printers and their status
   */
  async getPrinters() {
    try {
      if (this.isElectron() && typeof window.electronAPI.getPrinters === "function") {
        const printers = await window.electronAPI.getPrinters();
        return Array.isArray(printers) ? printers : [];
      }
      return [];
    } catch (err) {
      console.error("Error retrieving printers:", err);
      return [];
    }
  },

  /**
   * Print directly to a specific named device
   */
  async printToDevice(deviceName, silent = false) {
    try {
      if (this.isElectron() && typeof window.electronAPI.printToDevice === "function") {
        const result = await window.electronAPI.printToDevice({ deviceName, silent });
        return result;
      }
      return this.triggerPrint();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
