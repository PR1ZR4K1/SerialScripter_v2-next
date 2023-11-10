'use client';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Chip} from "@nextui-org/react";
import { Key, useEffect, useState } from "react";

type Column = {
    key: string;
    label: string;
};

type Row = {
    key: string;
    hostname: string,
    ip: string,
    os: string,
}

type AnsibleHostsTableProps = {
  os: string;
};


// type riskMapType = {
//     "Low": 'success';
//     "Medium": 'warning';
//     "High": 'danger'
// }

// const riskColorMap: riskMapType = {
//     "Low": "success",
//     "Medium": "warning",
//     "High": "danger"
// }

const columns = [
  {
    key: "hostname",
    label: "Hostname",
  },
  {
    key: "ip",
    label: "IP Address",
  },
  {
    key: "os",
    label: "Operating System",
  },
];

export default function AnsibleHostsTable({os}: AnsibleHostsTableProps) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));
  const [hosts, setHosts] = useState<Row[]>([]);

  // console.log('Selected Keys', selectedKeys)
  useEffect(() => {
      async function fetchHosts() {
      
        try {
              const url = os === 'windows' ? "/api/get/windowsHosts" : '/api/get/linuxHosts';
              const response = await fetch(url); // Replace with your actual API endpoint
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const data = await response.json();
              setHosts(data);  
          } catch (error) {
              console.error("Error fetching host data:", error);
          }
      }  
      fetchHosts();
  }, [os]);

  return (
    <div className="flex flex-col gap-3">
      <Table 
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys as any}
        aria-label="Selection behavior table example with dynamic content"
        selectionMode="multiple"
        selectionBehavior={'toggle'}
        classNames={{
          // th: "dark:bg-[#24344E]",
          td: "dark:bg-[#141B29]",
          wrapper: "max-h-[382px] dark:bg-[#141B29]",
          table: 'w-unit-9xl h-unit-9xl dark:bg-[#141B29] dark:border-[#141B29]',
          emptyWrapper: 'dark:bg-[#141B29]',
          base: 'dark:bg-transparent',
        }}
        
      >
        <TableHeader columns={columns}>
          {(column) => 
            <TableColumn key={column.key}>
                {column.label}
            </TableColumn>}
        </TableHeader>
        <TableBody emptyContent={"No hosts found"} items={hosts}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => 
                <TableCell>
                    {getKeyValue(item, columnKey)}
                </TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </div>
  );
}
