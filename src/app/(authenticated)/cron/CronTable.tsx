"use client"
import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

const rows = [{
  key: 1,
  JobName: "Job 1",
  Schedule: "Every 5 minutes",
  Actions: "Edit, Delete",
}]


export default function CronTable() {
  return (
    <Table aria-label="Example empty table">
      <TableHeader>
        <TableColumn>Job Name</TableColumn>
        <TableColumn>Schedule</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
