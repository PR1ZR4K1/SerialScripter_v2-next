import React, { useEffect, useState } from "react";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    Spinner,
    getKeyValue,
    Tooltip
} from "@nextui-org/react";
import { PlusIcon } from "@/icons/PlusIcon";
import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";
import { ChevronDownIcon } from "@/icons/ChevronDownIcon";
import { SearchIcon } from "@/icons/SearchIcon";
import { columns, statusOptions, serverLogs } from "@/data/data";
import { capitalize } from "@/utils/utils";
import Image from "next/image";
// import { getPageData } from "@/actions/serverActions";
import { Host, Status } from "@prisma/client";
import { DialogCustomAnimation } from "./Dialoge";
import { EyeIcon, InformationCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Edit } from "@mui/icons-material";
import toast from "react-hot-toast";
import { fetchScanResults } from "@/lib/enumerateNetwork";
import { addHostToDB } from '@/lib/addToDB'
import { useHostsStore } from "@/store/HostsStore";

const statusColorMap: Record<string, ChipProps["color"]> = {
    UP: "success",
    DOWN: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["hostname", "ip", "os", "incidents", "status", "actions"];



type DatagridProps = {
    handleDialogOpen: () => void;
};

// export function HostsTable({ handleDialogOpen }: DatagridProps) {
export function HostsTable() {

    const [filterValue, setFilterValue] = React.useState("");
    // const [hosts, setHosts] = React.useState<Host[]>([]);
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        direction: "ascending",
    });

    const [refetchCounter, setRefetchCounter, hosts, fetchHosts] = useHostsStore((state) => [
        state.refetchCounter, 
        state.setRefetchCounter,
        state.hosts,
        state.fetchHosts,
    ])

    const [open, setDialogOpen] = useState(false);

    useEffect(() => {


        fetchHosts();
    }, [refetchCounter, fetchHosts]);


    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredHosts = [...hosts];

        if (hasSearchFilter) {
            filteredHosts = filteredHosts.filter((user) =>
                user.hostname.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredHosts = filteredHosts.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }

        return filteredHosts;
    }, [hosts, filterValue, statusFilter, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);

    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Host, b: Host) => {
            const first = a[sortDescriptor.column as keyof Host] as number;
            const second = b[sortDescriptor.column as keyof Host] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((host: Host, columnKey: React.Key) => {
        const cellValue = host[columnKey as keyof Host];
        
        const handleDialogOpen = () => setDialogOpen(!open);
        switch (columnKey) {
            case "os":
                return (
                    <div className="flex flex-col">
                        <Image
                            alt='OS Img'
                            width={40}
                            height={40}
                            src={
                                typeof cellValue === 'string' ?
                                    (cellValue.toLowerCase() === 'windows'
                                        ? '/assets/windows.png'
                                        : cellValue.toLowerCase() === 'linux'
                                            ? '/assets/linux.png'
                                            : '/assets/router.png') // Replace 'other' with the third option
                                : '/assets/router.png' // Replace with appropriate source for non-string cellValue
                            }
                        />
                    </div>
                );
            case "hostname":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{typeof cellValue === 'string' ? cellValue : 'N/A' }</p>
                    </div>
                );
            case "ip":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue as any}</p>
                    </div>
                );
            case "incidents":
                return (
                    <div className="flex pl-6">
                        <p className="text-bold text-small capitalize">  
                            {
                                typeof cellValue === 'string' ?
                                    cellValue ? cellValue.toString() : "0"
                                : '0'
                            }
                        </p>
                    </div>
                );
            case "status":
                return (
                    <div className="flex items-center justify-center">
                        <Chip className="capitalize" color={statusColorMap[host.status]} size="sm" variant="flat">
                            {cellValue instanceof Date ? cellValue.toString() : cellValue}
                        </Chip>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-2 h-full ">
                        <Tooltip color="primary" content="View Host">
                            <span className="text-lg text-primary cursor-pointer active:opacity-50">
                                <EyeIcon width={25} height={25}/>
                            </span>
                        </Tooltip>
                        <Tooltip content="Brief Description">
                            <span className="text-lg text-warning cursor-pointer active:opacity-50">
                                <InformationCircleIcon width={25} height={25}/>
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Host">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <TrashIcon width={25} height={25}/>
                            </span>
                        </Tooltip>
                    </div>  
                );
            default:
                return cellValue !== undefined ? cellValue.toString() : '';
        }
    }, [open]);

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
    const [scanning, setScanning] = React.useState(false);
    const [updatingDB, setUpdating] = React.useState(false);

    const topContent = React.useMemo(() => {
        
        async function addHostsToDB (newHosts: Host[]) {
    
            for (const newHost of newHosts) {
                
                if (!newHost.hostname) {
                    const ipParts = newHost.ip.split('.');
                    const lastOctet = ipParts[ipParts.length - 1];
                    newHost.hostname = `host-${lastOctet}`;
                    console.log(newHost)
                }

                await addHostToDB(newHost);
            };

        }

        const handleScan = async () => {
            try {
                setScanning(true);
                setUpdating(true);

                // Wait for the scan results promise to resolve
                const scanResults: any = await toast.promise(
                    fetchScanResults('192.168.30.0/24'),
                    {
                        loading: 'Scanning...',
                        success: 'Scan Complete!',
                        error: 'Scan Failed!',
                    }
                );

                setScanning(false);

                if (scanResults.error) {
                    console.log('No you suck i am here')
                    toast.error(`Scan operation failed unexpectedly: ${scanResults.error}`);
                    setUpdating(false);
                    return;
                }

                console.log('Scan bitch',scanResults)

                // Now that scanResults is available, proceed to update the database
                await toast.promise(
                    addHostsToDB(scanResults),
                    {
                        loading: 'Updating Database...',
                        success: 'Database Updated!',
                        error: 'Database Update Failed!',
                    }
                );

                // make component refetch table data once all actions are completed
                fetchHosts();
                console.log('tried to fetch')


            } catch (error) {
                toast.error(`Scan operation failed unexpectedly: ${error}`);
            } finally {
                // Ensure that states are set correctly in case of success or failure
                setScanning(false);
                setUpdating(false);
            }
        };


        return (
            <div className="flex flex-col gap-4 ">
                <div className="flex justify-between gap-3 items-end ">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3 ">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" className="dark:hover:bg-[#27272A]">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" className="dark:hover:bg-[#27272A]">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button className={`dark:bg-[#2B3242] ${scanning || updatingDB ? '' : 'dark:hover:bg-[#27272A]'}`} onClick={handleScan} disabled={scanning || updatingDB}>
                            Scan Hosts
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {hosts.length} hosts</span>
                    <label className="flex color-black items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        hosts.length,
        onClear,
        scanning,
        updatingDB,
        setRefetchCounter,
        refetchCounter
    ]);

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

    return (

        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            // style={{ backgroundColor: 'white' }}
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                // th: "dark:bg-[#24344E]",
                td: "dark:bg-[#141B29]",
                wrapper: "max-h-[382px] dark:bg-[#141B29]",
                table: 'dark:bg-[#141B29] dark:border-[#141B29]',
                emptyWrapper: 'dark:bg-[#141B29]',
                base: 'dark:bg-transparent',
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns} className="dark:bg-[#24344E]">
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        className={`${column.uid === "actions" || column.uid === "status" ? "text-center " : ''} ${column.uid === "os" ? "pl-6" : ''} `}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody emptyContent={"No hosts found"} loadingContent={'Loading...'} items={sortedItems} className="">
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        {/* {(columnKey) => <TableCell>{                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">LAME</p>
                    </div>}</TableCell>} */}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

