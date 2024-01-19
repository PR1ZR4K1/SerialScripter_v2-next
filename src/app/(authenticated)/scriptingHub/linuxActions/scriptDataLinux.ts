const rows = [
  {
    id: 0,
    scriptName: "test",
    category: "testing",
    risk: "High",
    parameter: false,
    description: "testing the operation of ansible tings"
  },
  {
    id: 1,
    scriptName: "ssh_linux",
    category: "SSH",
    risk: "Low",
    parameter: true,
    description: "Adds or removes public key from remote host. Needs: ssh_public_key, ssh_state. Put public key in single quotes, ssh_state can be present or absent."
  },
  {
    id: 2,
    scriptName: "file_stat",
    category: "Network",
    risk: "Medium",
    parameter: true,
    description: "Locks down RDP access to specific IP ranges and enforces secure connection methods."
  },
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