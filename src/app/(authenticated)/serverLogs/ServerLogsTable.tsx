import React, { useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    getKeyValue,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { SearchIcon } from "@/icons/SearchIcon";
import { Prisma } from "@prisma/client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type filterFieldType = Omit<Prisma.ServerLogCreateManyInput, 'success' | 'timestamp' | 'id'>; 
type ServerLog = Omit<Prisma.ServerLogCreateManyInput, 'timestamp'> & {
    createdAt: string;
};


type ServerLogsTableType = {
    serverLogs: ServerLog[];
};

export default function ServerLogsTable({serverLogs}: ServerLogsTableType) {

    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [filterField, setFilterField] = React.useState<Set<keyof filterFieldType>>(new Set(["email" as keyof filterFieldType]));
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  
    const hasSearchFilter = Boolean(filterValue);
  
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        direction: "ascending",
    });
  
    const selectedFilterField: keyof filterFieldType = React.useMemo(
        () => Array.from(filterField).join(", ").replaceAll("_", " ") as keyof filterFieldType,
        [filterField]
    );
    
    const filteredItems = React.useMemo(() => {
      let filteredLogs = [...serverLogs];
  
      if (hasSearchFilter) {
        filteredLogs = filteredLogs.filter((log) => {
          // Determine which property to use for filtering
  
          if (log[selectedFilterField]) {
            // Perform the filtering using the chosen property
            return (log[selectedFilterField]).toLowerCase().includes(filterValue.toLowerCase());
          }
  
          // If neither 'name' nor 'username' is present, the row does not match the filter
          return false;
        });
      }
  
  
        return filteredLogs;
    }, [serverLogs, filterValue, hasSearchFilter, selectedFilterField]);
  
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
  
    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);
  
      const onPreviousPage = React.useCallback(() => {
          if (page > 1) {
              setPage(page - 1);
          }
      }, [page]);
  
      const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
          setRowsPerPage(Number(e.target.value));
          setPage(1);
      }, []);
  
      const onSearchChange = React.useCallback((value?: string) => {
          if (value) {
              setFilterValue(value);
              setPage(1);
          } else {
              setFilterValue("");
          }
      }, []);
  
      const onClear = React.useCallback(() => {
          setFilterValue("")
          setPage(1)
      }, [])
  
  
    const filteredRows = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
  
        return filteredItems.slice(start, end);
  
    }, [page, filteredItems, rowsPerPage]);    
    
    const sortedItems = useMemo(() => {
        return [...filteredRows].sort((a, b) => {
  
            const firstValue = a[sortDescriptor.column as keyof Prisma.ServerLogCreateManyInput];
            const secondValue = b[sortDescriptor.column as keyof Prisma.ServerLogCreateManyInput];
  
            let cmp;
  
            // Check if the values are numbers or strings and sort accordingly
            if (typeof firstValue === 'number' && typeof secondValue === 'number') {
                // Numeric sort
                cmp = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
            } else if (typeof firstValue === 'string' && typeof secondValue === 'string') {
                // String sort
                cmp = firstValue.localeCompare(secondValue, undefined, { sensitivity: 'base' });
            } else {
                // Fallback or throw an error if the types are not consistent or as expected
                // console.error('Inconsistent or unexpected data types for sorting');
                cmp = 0; // Or handle this case as you see fit
            }
  
            // Adjust for ascending or descending order
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredRows]);

    const topContent = useMemo(() => {

        const filterFieldOptions = [
            { key: "email", name: "Email" },
            { key: "module", name: "Module" },
            { key: "attribute", name: "Attribute" },
            { key: "value", name: "Value" },
            { key: "type", name: "Type" },
            { key: "description", name: "Description" },
        ];
        
        return (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-3 items-end ">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder={`Filter by ${selectedFilterField}...`}
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" className="dark:hover:bg-[#27272A]">
                                    Filter By
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={filterField}
                                selectionMode="single"
                                onSelectionChange={(keys: Selection) => setFilterField(keys as Set<keyof filterFieldType>)}
                            >
                                {filterFieldOptions.map((filterOption) => (
                                    <DropdownItem key={filterOption.key} className="capitalize">
                                        {(filterOption.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-default-400 text-small">Total {serverLogs.length} rows</span>
                        <label className="flex color-black items-center text-default-400 text-small">
                            Rows per page:
                            <select
                                className="bg-transparent outline-none text-default-400 text-small"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </label>
                    </div>
                </div>
            );
      }, [filterValue, onClear, onRowsPerPageChange, onSearchChange, serverLogs.length, filterField, selectedFilterField]);

    
    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2 ">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, page, pages, filteredItems.length, onNextPage, onPreviousPage]);
    
    const serverLogsColumns = [
        {
            key: "email",
            label: "Email",
            sortable: true,
        },
        {
            key: 'success',
            label: "Success",
            sortable: true,
        },
        {
            key: 'module',
            label: "Module",
            sortable: true,
        },
        {
            key: 'message',
            label: "Message",
            sortable: true,
        },
        {
            key: 'createdAt',
            label: "Created At",
        },
    ];

    const serverLogsColorMap: Record<string, ChipProps["color"]> = {
        true: "success",
        false: "danger",
    };
    
    return (
        <Table 
        aria-labelledby="Multi-Purpose Table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        isHeaderSticky={true}
        classNames={{
            th: "dark:bg-[#202F46] bg-gray-200",
            td: "dark:bg-[#141B29]",
            wrapper: "max-h-[382px] dark:bg-[#141B29]",
            table: 'dark:bg-[#141B29] dark:border-[#141B29] min-h-[250px]',
            emptyWrapper: 'dark:bg-[#141B29]',
            base: 'dark:bg-transparent',
        }}
        >
            <TableHeader columns={serverLogsColumns}>
                {(column) => 
                <TableColumn 
                    key={column.key} 
                    allowsSorting={column.sortable}
                    className={`${column.key === 'success' ? "text-center " : ''}`}
                >
                    {column.label}
                </TableColumn>
                }
            </TableHeader>
            <TableBody items={sortedItems} emptyContent={"Nothing to display."}>
                {(item) => (
                <TableRow key={item.id}>
                    {(columnKey) => 
                    <TableCell>
                        {columnKey === 'success' ? (
                            <div className="flex items-center justify-center ">
                            <Chip className="capitalize" color={serverLogsColorMap[item.success ? 'true' : 'false']} size="sm" variant="flat">
                                {item.success ? 'True' : 'False'}
                            </Chip>
                            </div>
                        ) : (
                            getKeyValue(item, columnKey)
                        )
                    }
                    </TableCell>
                    }
                </TableRow>
                )}
            </TableBody>
            </Table>
        );
}