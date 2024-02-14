const rows = [
  {
    id: 0,
    scriptName: "backup",
    category: "backups",
    risk: "low",
    parameter: true,
    description: "Makes a compressed backup of the specified directory and put it into the /opt/memento directory"
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
    scriptName: "install_docker",
    category: "Startup",
    risk: "High",
    parameter: false,
    description: "Checks for distribution of systems and installs docker"
  },
  {
    id: 3,
    scriptName: "Checksum",
    category: "Utility",
    risk: "Low",
    parameter: true,
    description: "Runs SHA256 algorithm to gather checksum of specified file or directory and outputs to standard output"
  },
  {
    id: 4,
    scriptName: "Linpeas",
    category: "Utility",
    risk: "High",
    parameter: false,
    description: "Downloads and runs Linpeas on Remote hosts and outputs results to Standard Out"
  },
  {
    id: 5,
    scriptName: "start_nftables_compose",
    category: "Startup",
    risk: "High",
    parameter: true,
    description: "Downloads and uses Nifty Firewall Tool's offical docker compose file and starts it on remote hosts"
  },
  {
    id: 6,
    scriptName: "restore_from_backup",
    category: "Utility",
    risk: "Low",
    parameter: true,
    description: "Attempts to restore from Backup created by Backup playbook"
  },
  {
    id: 7,
    scriptName: "start_nftables",
    category: "Startup",
    risk: "High",
    parameter: true,
    description: "Attempts Start Nifty Firewall Tool using strictly Ansible (Use only if compose failed)"
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