"use client"
import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function CronTable() {
  return (
    <Table aria-label="Example empty table">
      <TableHeader>
        <TableColumn>Job Name</TableColumn>
        <TableColumn>Schedule</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
    </Table>
  );
}
