const columns = [
  {
    name: 'ID',
    uid: 'id',
    sortable: true,
  },
  {
    name: 'OS',
    uid: 'os',
    sortable: true,
  },
  {
    name: 'HOSTNAME',
    uid: 'hostname',
    sortable: true,
  },
  {
    name: 'IP',
    uid: 'ip',
    sortable: false,
  },
  {
    name: 'INCIDENTS',
    uid: 'incidents',
    sortable: true,
  },
  {
    name: 'STATUS',
    uid: 'status',
    sortable: true,
  },
  {
    name: 'ACTIONS',
    uid: 'actions',
  },
]

const statusOptions = [
  {name: "Connected", uid: "connected"},
  {name: "Disconnected", uid: "disconnected"},
];

const hosts = [
  {id: 1, hostname: "Tyrion Lannister", ip: "192.168.1.9", os: "Windows", incidents: 4, status: "disconnected"},
  {id: 2, hostname: "Tyrion Lannister", ip: "192.168.1.2", os: "Windows", incidents: 0, status: "disconnected"},
  {id: 3, hostname: "Jon Snow", ip: "192.168.1.10", os: "Router", incidents: 4, status: "connected"},
  {id: 4, hostname: "Jaime Lannister", ip: "192.168.1.4", os: "FreeBSD", incidents: 3, status: "connected"},
  {id: 5, hostname: "Theon Greyjoy", ip: "192.168.1.2", os: "FreeBSD", incidents: 2, status: "disconnected"},
  {id: 6, hostname: "Brienne of Tarth", ip: "192.168.1.10", os: "Windows", incidents: 8, status: "disconnected"},
  {id: 7, hostname: "Arya Stark", ip: "192.168.1.2", os: "iOS", incidents: 7, status: "connected"},
  {id: 8, hostname: "Jon Snow", ip: "192.168.1.9", os: "MacOS", incidents: 7, status: "connected"},
  {id: 9, hostname: "Theon Greyjoy", ip: "192.168.1.8", os: "Windows", incidents: 3, status: "disconnected"},
  {id: 10, hostname: "Jon Snow", ip: "192.168.1.6", os: "FreeBSD", incidents: 7, status: "disconnected"},

]

const serverLogs = [
  {name: "Alice", timestamp: "2023-10-18T09:00:00Z", status: "signed in"},
  {name: "Bob", timestamp: "2023-10-18T09:05:00Z", status: "signed in"},
  {name: "Charlie", timestamp: "2023-10-18T09:10:00Z", status: "signed out"},
  {name: "David", timestamp: "2023-10-18T09:15:00Z", status: "signed in"},
  {name: "Eva", timestamp: "2023-10-18T09:20:00Z", status: "signed out"},
  {name: "Frank", timestamp: "2023-10-18T09:25:00Z", status: "signed in"},
  {name: "Grace", timestamp: "2023-10-18T09:30:00Z", status: "signed out"},
  {name: "Hannah", timestamp: "2023-10-18T09:35:00Z", status: "signed in"},
  {name: "Ian", timestamp: "2023-10-18T09:40:00Z", status: "signed out"},
  {name: "Jill", timestamp: "2023-10-18T09:45:00Z", status: "signed in"},
  {name: "Kevin", timestamp: "2023-10-18T09:50:00Z", status: "signed out"},
  {name: "Laura", timestamp: "2023-10-18T09:55:00Z", status: "signed in"},
  {name: "Mike", timestamp: "2023-10-18T10:00:00Z", status: "signed out"},
  {name: "Nina", timestamp: "2023-10-18T10:05:00Z", status: "signed in"},
  {name: "Oscar", timestamp: "2023-10-18T10:10:00Z", status: "signed out"},
  {name: "Patty", timestamp: "2023-10-18T10:15:00Z", status: "signed in"},
  {name: "Quincy", timestamp: "2023-10-18T10:20:00Z", status: "signed out"},
  {name: "Rachel", timestamp: "2023-10-18T10:25:00Z", status: "signed in"},
  {name: "Steve", timestamp: "2023-10-18T10:30:00Z", status: "signed out"},
  {name: "Tina", timestamp: "2023-10-18T10:35:00Z", status: "signed in"},
  {name: "Ulysses", timestamp: "2023-10-18T10:40:00Z", status: "signed out"},
  {name: "Vera", timestamp: "2023-10-18T10:45:00Z", status: "signed in"},
  {name: "Will", timestamp: "2023-10-18T10:50:00Z", status: "signed out"},
  {name: "Xena", timestamp: "2023-10-18T10:55:00Z", status: "signed in"},
  {name: "Yara", timestamp: "2023-10-18T11:00:00Z", status: "signed out"},
];

export {columns, hosts, statusOptions, serverLogs};
