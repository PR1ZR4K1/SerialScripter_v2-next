'use client';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Radio, RadioGroup, Chip} from "@nextui-org/react";
import ScripterModal from '@/components/ScripterModal';
import { Key, useState } from "react";
import { useScriptingHubStore } from "@/store/ScriptingHubStore";

type Column = {
    key: string;
    label: string;
};

type Row = {
    id: number;
    scriptName: string;
    category: string;
    risk: string;
    description: string
}

type ScriptingHubTableProps = {
    columns: Column[];
    rows: Row[];
    os: string;
};

type riskMapType = {
    "Low": 'success';
    "Medium": 'warning';
    "High": 'danger'
}

const riskColorMap: riskMapType = {
    "Low": "success",
    "Medium": "warning",
    "High": "danger"
}

function renderColumn(item: Row, columnKey: Key) {
  if (columnKey === 'description') {
    return (
      <div className="flex justify-center">
        <ScripterModal scriptName={item.scriptName} description={item.description} /> 
      </div>
    );
  } else if (columnKey === 'risk') {
    // Your logic for 'category' goes here
    return (
        <div className="flex justify-center">
            <Chip className="capitalize" color={riskColorMap[item.risk as keyof riskMapType]} size="sm" variant="flat">
            {item.risk}
            </Chip>
        </div>
    );
  } else {
    return getKeyValue(item, columnKey);
  }
}


export default function AnsiblePlaybooksTable({columns, rows, os}: ScriptingHubTableProps) {

  const [selectedKeysLinuxPlaybooks, setSelectedKeysLinuxPlaybooks, selectedKeysWindowsPlaybooks, setSelectedKeysWindowsPlaybooks] =   useScriptingHubStore((state) => [
    state.selectedKeysLinuxPlaybooks,
    state.setSelectedKeysLinuxPlaybooks,
    state.selectedKeysWindowsPlaybooks,
    state.setSelectedKeysWindowsPlaybooks,
  ])


  return (
    <div className="flex flex-col gap-3">
      <Table 
        disallowEmptySelection
        selectedKeys={os.toLowerCase() === 'linux' ? selectedKeysLinuxPlaybooks : selectedKeysWindowsPlaybooks}
        onSelectionChange={os.toLowerCase() === 'linux' ? setSelectedKeysLinuxPlaybooks as any : setSelectedKeysWindowsPlaybooks as any}
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
                {column.key === 'description' || column.key === 'risk' ? <div className="flex justify-center"> {column.label} </div> : <div>{column.label} </div>}
            </TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.id}> 
              {(columnKey) => 
                <TableCell>
                    {
                        renderColumn(item, columnKey)
                    }
                </TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </div>
  );
}
