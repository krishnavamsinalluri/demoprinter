/**
 * Local Data Storage Service
 * 
 * Interacts with Electron's secure IPC storage (userData/employees.json)
 * with a fallback to localStorage when running in a standard web browser.
 * Keeps data completely local without any external server or API dependency.
 */

const LOCAL_STORAGE_KEY = "demo_employees_db";

const DEFAULT_SEED_DATA = [
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

export const storageService = {
  /**
   * Check if running inside Electron environment
   */
  isElectron: () => {
    return typeof window !== "undefined" && Boolean(window.electronAPI?.isElectron);
  },

  /**
   * Fetch all employee records
   */
  async getAllEmployees() {
    if (this.isElectron()) {
      try {
        const records = await window.electronAPI.getEmployees();
        return Array.isArray(records) ? records : DEFAULT_SEED_DATA;
      } catch (err) {
        console.error("Electron IPC read error, falling back:", err);
      }
    }

    // Web LocalStorage Fallback
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
      return DEFAULT_SEED_DATA;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SEED_DATA;
    }
  },

  /**
   * Save entire list of employees
   */
  async saveAllEmployees(employees) {
    if (this.isElectron()) {
      try {
        const result = await window.electronAPI.saveEmployees(employees);
        if (result && !result.success) {
          throw new Error(result.error || "Failed to write data file");
        }
        return { success: true };
      } catch (err) {
        console.error("Electron IPC write error:", err);
        throw err;
      }
    }

    // Web LocalStorage Fallback
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
    return { success: true };
  },

  /**
   * Add a new employee
   */
  async addEmployee(newEmployee) {
    const list = await this.getAllEmployees();
    // Verify uniqueness of ID
    if (list.some((e) => e.id.toLowerCase() === newEmployee.id.trim().toLowerCase())) {
      throw new Error(`Employee ID "${newEmployee.id}" is already assigned to another employee.`);
    }

    const record = {
      ...newEmployee,
      id: newEmployee.id.trim().toUpperCase(),
      salary: Number(newEmployee.salary),
      joinedDate: newEmployee.joinedDate || new Date().toISOString().split("T")[0],
    };

    const updatedList = [record, ...list];
    await this.saveAllEmployees(updatedList);
    return record;
  },

  /**
   * Update an existing employee
   */
  async updateEmployee(id, updatedFields) {
    const list = await this.getAllEmployees();
    const index = list.findIndex((e) => e.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    const updatedRecord = {
      ...list[index],
      ...updatedFields,
      id: list[index].id, // Keep ID unchanged
      salary: Number(updatedFields.salary ?? list[index].salary),
    };

    list[index] = updatedRecord;
    await this.saveAllEmployees(list);
    return updatedRecord;
  },

  /**
   * Delete an employee
   */
  async deleteEmployee(id) {
    const list = await this.getAllEmployees();
    const updatedList = list.filter((e) => e.id.toLowerCase() !== id.toLowerCase());
    if (list.length === updatedList.length) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    await this.saveAllEmployees(updatedList);
    return { success: true };
  },

  /**
   * Reset data to default demo seed records
   */
  async resetDemoData() {
    if (this.isElectron()) {
      try {
        const records = await window.electronAPI.resetDemoData();
        return records;
      } catch (err) {
        console.error("Electron reset error:", err);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    return DEFAULT_SEED_DATA;
  },
};
