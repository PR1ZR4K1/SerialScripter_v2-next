import { useHostsStore } from "@/store/HostsStore";
import { Card, Typography } from "@material-tailwind/react";
import { Chip,ChipProps } from "@nextui-org/react";
import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";


 
 
export default function TableServices() {

  const columns = [
      {
        key: 'name',
        label: "Name"
      },

      {
        key: 'port',
        label: "Port",
      }, 
      {
        key: 'description',
        label: "Description"
      },
      
      {
        key: 'status',
        label: "Status"
      }
  ];

  const statusColorMap: Record<string, ChipProps["color"]> = {
      UP: "success",
      DOWN: "danger",
  };

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const services = host.networkServices || [];

  return (
    <Table>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={services}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>
              {columnKey === 'status' ? (
                <div className="flex items-center justify-center">
                  <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
                    {item.status}
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