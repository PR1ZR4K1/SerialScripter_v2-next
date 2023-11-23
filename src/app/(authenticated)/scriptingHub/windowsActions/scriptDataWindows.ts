const rows = [
  {
    id: 1,
    scriptName: "Win_Defender_Setup",
    category: "Anti-Malware",
    risk: "High",
    description: "Enhances Windows Defender settings for optimal protection and automated scans."
  },
  {
    id: 2,
    scriptName: "RDP_Security_Enhancer",
    category: "Network",
    risk: "Medium",
    description: "Locks down RDP access to specific IP ranges and enforces secure connection methods."
  },
  {
    id: 3,
    scriptName: "User_Account_Reviewer",
    category: "User Management",
    risk: "Medium",
    description: "Reviews user accounts for potential security risks such as shared or generic logins."
  },
  {
    id: 4,
    scriptName: "UAC_Optimizer",
    category: "System",
    risk: "Low",
    description: "Tweaks User Account Control settings for a balanced mix of usability and security."
  },
  {
    id: 5,
    scriptName: "Event_Log_Monitor",
    category: "Logging & Monitoring",
    risk: "Medium",
    description: "Configures and optimizes Event Viewer settings to ensure important events are logged and retained."
  },
  {
    id: 6,
    scriptName: "PowerShell_Securer",
    category: "Scripting",
    risk: "Medium",
    description: "Disables potentially harmful PowerShell features and limits script execution policies."
  },
  {
    id: 7,
    scriptName: "BitLocker_Setup",
    category: "Encryption",
    risk: "High",
    description: "Configures BitLocker Drive Encryption for optimal security and protection against data theft."
  },
  {
    id: 8,
    scriptName: "Startup_Audit",
    category: "Maintenance",
    risk: "Low",
    description: "Reviews and cleans up unnecessary startup programs, enhancing boot time and system performance."
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