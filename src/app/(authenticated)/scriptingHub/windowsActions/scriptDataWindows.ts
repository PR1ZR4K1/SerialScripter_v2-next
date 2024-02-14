const rows = [
  {
    id: 0,
    scriptName: "windows",
    category: "windows",
    risk: "Medium",
    parameter: true,
    description: "Attempts to add vm to Domain"
  },
  {
    id: 1,
    scriptName: "firewalls",
    category: "windows",
    risk: "Low",
    parameter: false,
    description: "displays firewall rules"
  },
  {
    id: 2,
    scriptName: "software",
    category: "windows",
    risk: "Low",
    parameter: false,
    description: "displays downloaded software "
  },
  {
    id: 3,
    scriptName: "winpeas",
    category: "windows",
    risk: "Medium",
    parameter: false,
    description: "Attempts to install and run WinPeas on machine."
  },
  {
    id: 4,
    scriptName: "fileIntegrityCheck",
    category: "Enumeration",
    risk: "Low",
    parameter: true,
    description: "Returns MD5 Hash of specified file, add path=C:/Use/Forward/Slashes.exe to -e parameter."
  },
  {
    id: 5,
    scriptName: "installSysmon",
    category: "Software Install",
    risk: "Low",
    parameter: false,
    description: "Installs sysmon64, doesn't work below win7/2008"
  },
  {
    id: 6,
    scriptName: "installedSoftwareWIN",
    category: "Enumeration",
    risk: "Low",
    parameter: false,
    description: "Lists installed shi"
  },
  {
    id: 7,
    scriptName: "listCommonDirWIN",
    category: "Enumeration",
    risk: "Low",
    parameter: false,
    description: "Lists contents of C Drive and every common directory in Users folder"
  },
  {
    id: 8,
    scriptName: "dlrunchainsaw",
    category: "Enumeration",
    risk: "Low",
    parameter: false,
    description: "Install and run chainsaw on machine"
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