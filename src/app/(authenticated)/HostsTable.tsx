'use client'
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
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    Tooltip
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/icons/ChevronDownIcon";
import { SearchIcon } from "@/icons/SearchIcon";
import { columns, statusOptions } from "@/data/data";
import { capitalize } from "@/utils/utils";
import Image from "next/image";
import { Host as PrismaHost, OS } from '@prisma/client';
import { EyeIcon, InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { fetchScanResults } from "@/lib/enumerateNetwork";
import { addHostToDB } from '@/lib/addToDB'
import { useHostsStore } from '@/store/HostsStore';
import Link from "next/link";

const statusColorMap: Record<string, ChipProps["color"]> = {
    UP: "success",
    DOWN: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["hostname", "ip", "os", "status", "actions"];

type Host = PrismaHost & {
  os?: OS;
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

    // const [refetchCounter, setRefetchCounter] = React.useState(0);

    const [refetchCounter, setRefetchCounter, hosts, fetchHosts] = useHostsStore((state) => [
        state.refetchCounter, 
        state.setRefetchCounter,
        state.hosts,
        state.fetchHosts,
    ]);

    const [timeRefetched, setTimeRefetched] = useState(Date.now());

    function getTimeDifference(timeRefetched: number) {
        const currentTime = Date.now();
        const timeDifference = currentTime - timeRefetched; // Difference in milliseconds

        // Convert to seconds and format to two decimal places
        const timeInSeconds = (timeDifference / 1000).toFixed(2);

        return parseFloat(timeInSeconds);
    }


    useEffect(() => {
        // console.log('Refetch Counter updated to: ', refetchCounter);
        const timeDifference = getTimeDifference(timeRefetched);

        // initial refetch condition
        if (refetchCounter === 0) {
            fetchHosts();
        }

        // check if enough time has passed to revalidate data
        if (timeDifference >= 10) {
            fetchHosts();
            setTimeRefetched(Date.now())
            toast.success('Revalidated Host Data!');
        }
        // prevent toast from popping up if it has been less than half a second since last 
        // validation
        else if (timeDifference > 1 && timeDifference < 10) {
            const timeLeft = (10 - timeDifference).toFixed(2);

            toast.error(`You must wait ${timeLeft} more seconds before revalidating...` )
        }

    }, [fetchHosts, refetchCounter, timeRefetched])

    const [open, setDialogOpen] = useState(false);


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
        
        // const handleDialogOpen = () => setDialogOpen(!open);
        if (columnKey === "os") {
            const osName = host.os?.name || 'unknown'; // Fallback to 'unknown' if os or os.name is undefined
            let imgSrc = '/assets/router.png'; // Default image

            if (osName.toLowerCase() === 'windows') {
                imgSrc = '/assets/windows.png';
            } else if (osName.toLowerCase() === 'linux') {
                imgSrc = '/assets/linux.png';
            }

            return (
                <div className="flex flex-col">
                    <Image
                        alt='OS Img'
                        width={40}
                        height={40}
                        src={imgSrc}
                    />
                </div>
            );
        }
        
        switch (columnKey) {
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
            case "status":
                return (
                    <div className="flex items-center justify-center">
                        <Chip className="capitalize" color={statusColorMap[host.status]} size="sm" variant="flat">
                    {typeof cellValue === 'string' ? cellValue : 'Unknown'}
                        </Chip>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-2 h-full ">
                        <Link href={`/${host.hostname}`}>
                            <Tooltip color="primary" content="View Host">
                                <span className="text-lg text-primary cursor-pointer active:opacity-50">
                                    <EyeIcon width={25} height={25}/>
                                </span>
                            </Tooltip>
                        </Link>
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
            // default:
            //     return cellValue !== undefined ? cellValue.toString() : '';
        }
    }, []);

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

    // state handlers used to disable/enable the scan button
    const [scanning, setScanning] = React.useState(false);
    const [updatingDB, setUpdating] = React.useState(false);

    const topContent = React.useMemo(() => {

        // function to add all enumerated hosts to db
        // created so I can determine when all hosts have been added to the db
        // then I can render my toast for the user

        async function addHostsToDB (newHosts: Host[]) {
    
            for (const newHost of newHosts) {
                
                // create hostname if nmap scan didn't grab it
                // should be host-(last octet of ip)
                if (!newHost.hostname) {
                    const ipParts = newHost.ip.split('.');
                    const lastOctet = ipParts[ipParts.length - 1];
                    newHost.hostname = `host-${lastOctet}`;
                    // console.log(newHost)
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
                    fetchScanResults('192.168.60.0/24'),
                    {
                        loading: 'Scanning...',
                        success: 'Scan Complete!',
                        error: 'Scan Failed!',
                    }
                );

                if (scanResults.error) {
                    // console.log('No you suck i am here')
                    toast.error(`Scan operation failed unexpectedly: ${scanResults.error}`);
                    setUpdating(false);
                    return;
                }

                // console.log('Scan...',scanResults)

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
                // await fetchHosts();
                // console.log('tried to fetch')
                // revalidateTag 
                // console.log('revalidating tag');
                // revalidate();
                // console.log('refetching');
                // setRefetchCounter();
                // console.log('incremented refetch counter: ', refetchCounter);

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
                        <Button className={`dark:bg-[#2B3242] hover:bg-[#27272A]`} onClick={() => {setRefetchCounter()}}>
                            Revalidate
                        </Button>
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
            aria-label="Host table with custom cells, pagination and sorting"
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
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

