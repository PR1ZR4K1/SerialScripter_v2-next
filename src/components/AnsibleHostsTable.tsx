'use client';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Chip} from "@nextui-org/react";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import { useScriptingHubStore } from '@/store/ScriptingHubStore';

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
    key: "os",
    label: "Operating System",
  },
  {
    key: "hostname",
    label: "Hostname",
  },
  {
    key: "ip",
    label: "IP Address",
  },

];


                        // <Image
                        //     alt='OS Img'
                        //     width={40}
                        //     height={40}
                        //     src={
                        //         typeof cellValue === 'string' ?
                        //             (cellValue.toLowerCase() === 'windows'
                        //                 ? '/assets/windows.png'
                        //                 : cellValue.toLowerCase() === 'linux'
                        //                     ? '/assets/linux.png'
                        //                     : '/assets/router.png') // Replace 'other' with the third option
                        //         : '/assets/router.png' // Replace with appropriate source for non-string cellValue
                        //     }
                        // />

export default function AnsibleHostsTable({os}: AnsibleHostsTableProps) {
  const [ linuxHosts,  getLinuxHosts, windowsHosts, getWindowsHosts, selectedKeysLinuxHosts, setSelectedKeysLinuxHosts, selectedKeysWindowsHosts, setSelectedKeysWindowsHosts] =   useScriptingHubStore((state) => [
    state.linuxHosts,
    state.getLinuxHosts,
    state.windowsHosts,
    state.getWindowsHosts,
    state.selectedKeysLinuxHosts,
    state.setSelectedKeysLinuxHosts,
    state.selectedKeysWindowsHosts,
    state.setSelectedKeysWindowsHosts,
  ])

  // console.log('Selected Keys', selectedKeys)
  useEffect(() => {

      os.toLowerCase() === 'linux' ?  
        getLinuxHosts()
      :
        getWindowsHosts()
      }, 

    [getLinuxHosts, getWindowsHosts, os]);

  return (
    <div className="flex flex-col gap-3">
      <Table 
        disallowEmptySelection
        selectedKeys={os.toLowerCase() === 'linux' ? selectedKeysLinuxHosts : selectedKeysWindowsHosts}
        // each time a row is selected or deselected update the set of selectedkeys
        onSelectionChange={os.toLowerCase() === 'linux' ? setSelectedKeysLinuxHosts as any : setSelectedKeysWindowsHosts as any}
        aria-label="Selection behavior table with dynamic content"
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
                { column.key === 'os' ? <div className="flex justify-center"> {column.label} </div> : <div>{column.label} </div>}
            </TableColumn>}
        </TableHeader>
        <TableBody emptyContent={"No hosts found"} loadingContent={'Loading...'} items={os === 'linux' ? linuxHosts : windowsHosts}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => 
                <TableCell>
                    {
                      columnKey === 'os' ? 
                        (
                          <div className="flex justify-center items-center">                        
                            <Image
                                  alt='OS Img'
                                  width={40}
                                  height={40}
                                  src={
                                        os.toLowerCase() === 'windows'
                                          ? 
                                            '/assets/windows.png'
                                          : 
                                            '/assets/linux.png'
                                      }
                            />
                          </div>
                        )
                      :
                        getKeyValue(item, columnKey)
                      
                    }
                </TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </div>
  );
}
