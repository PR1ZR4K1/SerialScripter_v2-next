const rows = [
  {
    id: 0,
    scriptName: "backup",
    category: "Backups",
    risk: "low",
    parameter: true,
    description: "Makes a compressed backup of the specified directory and put it into the /opt/memento directory. Parameter Usage: target_path=/tmp"
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
    scriptName: "linpeas",
    category: "Utility",
    risk: "High",
    parameter: false,
    description: "Downloads and runs Linpeas on Remote hosts and outputs results to Standard Out"
  },
  {
    id: 4,
    scriptName: "start_nftables_compose",
    category: "Startup",
    risk: "High",
    parameter: true,
    description: "Downloads and uses Nifty Firewall Tool's offical docker compose file and starts it on remote hosts. Parameter Usage: API_KEY=1234"
  },
  {
    id: 5,
    scriptName: "restore_from_backup",
    category: "Utility",
    risk: "Low",
    parameter: true,
    description: "Attempts to restore from Backup created by Backup playbook. Parameter Usage: target_path=/tmp/"
  },
  {
    id: 6,
    scriptName: "start_nftables",
    category: "Startup",
    risk: "High",
    parameter: true,
    description: "Attempts Start Nifty Firewall Tool using strictly Ansible (Use only if compose failed)"
  },
  {
    id: 7,
    scriptName: "integrity",
    category: "Backups",
    risk: "Low",
    parameter: true,
    description: "Checks file hash of specified target_path and returns it. Parameter Usage: target_path=/tmp/test.txt"
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