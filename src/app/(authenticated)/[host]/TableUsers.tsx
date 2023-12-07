import { useHostsStore } from "@/store/HostsStore";
import { Card, Typography } from "@material-tailwind/react";
import { Chip,ChipProps } from "@nextui-org/react";
import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
 
 
export default function TableUsers() {

  const columns = [
    {
      key: 'username',
      label: "Username"
    }, 
    {
      key: 'password', 
      label: "Password"
    },
    {
      key: 'type', 
      label: "Type"
    }
  ];
  

  const userTypeColorMap: Record<string, ChipProps["color"]> = {
      USER: "success",
      PRIVILEGED: "danger",
  };

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const users = host.userAccounts || [];

  return (
    <Table>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>
              {columnKey === 'type' ? (
                <div className="flex items-center justify-center">
                  <Chip className="capitalize" color={userTypeColorMap[item.userType]} size="sm" variant="flat">
                    {item.userType}
                  </Chip>
                </div>
              ) 
              : 
              getKeyValue(item, columnKey)}</TableCell>  
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}