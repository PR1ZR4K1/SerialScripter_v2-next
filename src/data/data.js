import React from "react";

// const columns = [
//   {name: "ID", uid: "id", sortable: true},
//   {name: "NAME", uid: "name", sortable: true},
//   {name: "AGE", uid: "age", sortable: true},
//   {name: "ROLE", uid: "role", sortable: true},
//   {name: "TEAM", uid: "team"},
//   {name: "EMAIL", uid: "email"},
//   {name: "STATUS", uid: "status", sortable: true},
//   {name: "ACTIONS", uid: "actions"},
// ];

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
    sortable: true,
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

// const users = [
//   {
//     id: 1,
//     name: "Tony Reichert",
//     role: "CEO",
//     team: "Management",
//     status: "active",
//     age: "29",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     email: "tony.reichert@example.com",
//   },
//   {
//     id: 2,
//     name: "Zoey Lang",
//     role: "Tech Lead",
//     team: "Development",
//     status: "paused",
//     age: "25",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
//     email: "zoey.lang@example.com",
//   },
//   {
//     id: 3,
//     name: "Jane Fisher",
//     role: "Sr. Dev",
//     team: "Development",
//     status: "active",
//     age: "22",
//     avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
//     email: "jane.fisher@example.com",
//   },
//   {
//     id: 4,
//     name: "William Howard",
//     role: "C.M.",
//     team: "Marketing",
//     status: "connected",
//     age: "28",
//     avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
//     email: "william.howard@example.com",
//   },
//   {
//     id: 5,
//     name: "Kristen Copper",
//     role: "S. Manager",
//     team: "Sales",
//     status: "active",
//     age: "24",
//     avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
//     email: "kristen.cooper@example.com",
//   },
//   {
//     id: 6,
//     name: "Brian Kim",
//     role: "P. Manager",
//     team: "Management",
//     age: "29",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     email: "brian.kim@example.com",
//     status: "Active",
//   },
//   {
//     id: 7,
//     name: "Michael Hunt",
//     role: "Designer",
//     team: "Design",
//     status: "paused",
//     age: "27",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
//     email: "michael.hunt@example.com",
//   },
//   {
//     id: 8,
//     name: "Samantha Brooks",
//     role: "HR Manager",
//     team: "HR",
//     status: "active",
//     age: "31",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
//     email: "samantha.brooks@example.com",
//   },
//   {
//     id: 9,
//     name: "Frank Harrison",
//     role: "F. Manager",
//     team: "Finance",
//     status: "connected",
//     age: "33",
//     avatar: "https://i.pravatar.cc/150?img=4",
//     email: "frank.harrison@example.com",
//   },
//   {
//     id: 10,
//     name: "Emma Adams",
//     role: "Ops Manager",
//     team: "Operations",
//     status: "active",
//     age: "35",
//     avatar: "https://i.pravatar.cc/150?img=5",
//     email: "emma.adams@example.com",
//   },
//   {
//     id: 11,
//     name: "Brandon Stevens",
//     role: "Jr. Dev",
//     team: "Development",
//     status: "active",
//     age: "22",
//     avatar: "https://i.pravatar.cc/150?img=8",
//     email: "brandon.stevens@example.com",
//   },
//   {
//     id: 12,
//     name: "Megan Richards",
//     role: "P. Manager",
//     team: "Product",
//     status: "paused",
//     age: "28",
//     avatar: "https://i.pravatar.cc/150?img=10",
//     email: "megan.richards@example.com",
//   },
//   {
//     id: 13,
//     name: "Oliver Scott",
//     role: "S. Manager",
//     team: "Security",
//     status: "active",
//     age: "37",
//     avatar: "https://i.pravatar.cc/150?img=12",
//     email: "oliver.scott@example.com",
//   },
//   {
//     id: 14,
//     name: "Grace Allen",
//     role: "M. Specialist",
//     team: "Marketing",
//     status: "active",
//     age: "30",
//     avatar: "https://i.pravatar.cc/150?img=16",
//     email: "grace.allen@example.com",
//   },
//   {
//     id: 15,
//     name: "Noah Carter",
//     role: "IT Specialist",
//     team: "I. Technology",
//     status: "paused",
//     age: "31",
//     avatar: "https://i.pravatar.cc/150?img=15",
//     email: "noah.carter@example.com",
//   },
//   {
//     id: 16,
//     name: "Ava Perez",
//     role: "Manager",
//     team: "Sales",
//     status: "active",
//     age: "29",
//     avatar: "https://i.pravatar.cc/150?img=20",
//     email: "ava.perez@example.com",
//   },
//   {
//     id: 17,
//     name: "Liam Johnson",
//     role: "Data Analyst",
//     team: "Analysis",
//     status: "active",
//     age: "28",
//     avatar: "https://i.pravatar.cc/150?img=33",
//     email: "liam.johnson@example.com",
//   },
//   {
//     id: 18,
//     name: "Sophia Taylor",
//     role: "QA Analyst",
//     team: "Testing",
//     status: "active",
//     age: "27",
//     avatar: "https://i.pravatar.cc/150?img=29",
//     email: "sophia.taylor@example.com",
//   },
//   {
//     id: 19,
//     name: "Lucas Harris",
//     role: "Administrator",
//     team: "Information Technology",
//     status: "paused",
//     age: "32",
//     avatar: "https://i.pravatar.cc/150?img=50",
//     email: "lucas.harris@example.com",
//   },
//   {
//     id: 20,
//     name: "Mia Robinson",
//     role: "Coordinator",
//     team: "Operations",
//     status: "active",
//     age: "26",
//     avatar: "https://i.pravatar.cc/150?img=45",
//     email: "mia.robinson@example.com",
//   },
// ];

const users = [
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

const RlogColumns = [
  {
    name: 'ID',
    uid: 'id',
    sortable: true,
  },
  {
    name: 'TIMESTAMP',
    uid: 'timestamp',
    sortable: true,
  },
  {
    name: 'FACILITYSEVERITY',
    uid: 'facilityseverity',
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
    sortable: true,
  },
  {
    name: 'SYSLOGTAG',
    uid: 'syslogtag',
    sortable: true,
  },
  {
    name: 'LOGMESSAGE',
    uid: 'logmessage',
    sortable: true,
  },
  {
    name: 'ACTIONS',
    uid: 'actions',
  },
]

const rlogs = [
  {id: 1, timestamp: 1698694522, facilityseverity: "user.info", hostname: "Tyrion Lannister", ip: "192.168.1.9", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 2, timestamp: 1698694462, facilityseverity: "user.info", hostname: "Theon Greyjoy", ip: "192.168.1.2", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 3, timestamp: 1698693982, facilityseverity: "user.info", hostname: "Jon Snow", ip: "192.168.1.10", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 4, timestamp: 1698694102, facilityseverity: "user.info", hostname: "Tyrion Lannister", ip: "192.168.1.9", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 5, timestamp: 1698694402, facilityseverity: "user.info", hostname: "Theon Greyjoy", ip: "192.168.1.2", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 6, timestamp: 1698694042, facilityseverity: "user.info", hostname: "Tyrion Lannister", ip: "192.168.1.9", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 7, timestamp: 1698694162, facilityseverity: "user.info", hostname: "Jon Snow", ip: "192.168.1.10", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 8, timestamp: 1698694222, facilityseverity: "user.info", hostname: "Tyrion Lannister", ip: "192.168.1.9", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 9, timestamp: 1698694342, facilityseverity: "user.info", hostname: "Tyrion Lannister", ip: "192.168.1.9", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
  {id: 10, timestamp: 1698694342, facilityseverity: "user.info", hostname: "Jon Snow", ip: "192.168.1.10", syslogtag: "/usr/libexec/gdm-x-session[2834]", logmessage: "Yuh my log message is super cool and very super duper long"},
]

export {columns, users, RlogColumns, statusOptions, rlogs};
