const rows = [
  {
    id: 0,
    scriptName: "SSH_Hardener",
    category: "Authentication",
    risk: "Medium",
    description: "Disables root login, enforces key-based authentication, and sets SSH protocol to 2."
  },
  {
    id: 1,
    scriptName: "Firewall_Setup",
    category: "Network",
    risk: "High",
    description: "Configures UFW to allow only necessary ports and deny all incoming connections by default."
  },
  {
    id: 2,
    scriptName: "Sysctl_Optimizer",
    category: "Kernel",
    risk: "Medium",
    description: "Tweaks sysctl settings to enhance security measures at the kernel level."
  },
  {
    id: 3,
    scriptName: "User_Permission_Fixer",
    category: "User Management",
    risk: "Low",
    description: "Checks and corrects file and directory permissions to prevent unauthorized access."
  },
  {
    id: 4,
    scriptName: "AuditD_Installer",
    category: "Logging & Monitoring",
    risk: "Medium",
    description: "Installs and configures AuditD for monitoring system calls and activities."
  },
  {
    id: 5,
    scriptName: "Cron_Cleaner",
    category: "Maintenance",
    risk: "Low",
    description: "Removes unnecessary or potentially harmful cron jobs set by default or by software."
  }
];


const columns = [
  {
    key: "scriptName",
    label: "Script Name",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "risk",
    label: "Risk Level",
  },
  {
    key: "description",
    label: "Description",
  },
];

export {columns, rows};