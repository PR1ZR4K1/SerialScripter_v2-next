// "use client"
// import React from "react";

// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Input,
//   Button,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Chip,
//   User,
//   Pagination,
//   Selection,
//   ChipProps,
//   SortDescriptor
// } from "@nextui-org/react";
// import {PlusIcon} from "@/icons/PlusIcon";
// import {VerticalDotsIcon} from "@/icons/VerticalDotsIcon";
// import {ChevronDownIcon} from "@/icons/ChevronDownIcon";
// import {SearchIcon} from "@/icons/SearchIcon";
// import {RlogColumns, rlogs, RlogStatusOptions} from "@/data/data";
// import {capitalize, convertPOSIXTimestampToLocalTime, truncateDescription} from "@/utils/utils";
// import Image from "next/image";

// const statusColorMap: Record<string, ChipProps["color"]> = {
//     info: "success",
//     error: "danger",
//   };

// const INITIAL_VISIBLE_COLUMNS = ["timestamp", "facilityseverity", "hostname", "ip", "syslogtag", "logmessage", "actions"];

// type Rlog = typeof rlogs[0];

// type DatagridProps = {
//   handleDialogOpen: () => void;
// };

// export function LogGrid({handleDialogOpen}: DatagridProps) {

//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
//   const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
//   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
//     direction: "ascending",
//   });

//   const [page, setPage] = React.useState(1);

//   const hasSearchFilter = Boolean(filterValue);

//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return RlogColumns;

//     return RlogColumns.filter((RlogColumn) => Array.from(visibleColumns).includes(RlogColumn.uid));
//   }, [visibleColumns]);

//   const filteredItems = React.useMemo(() => {
//     let filteredLogs = [...rlogs];

//     if (hasSearchFilter) {
//       filteredLogs = filteredLogs.filter((rlog) =>
//         rlog.hostname.toLowerCase().includes(filterValue.toLowerCase()),
//       );
//     }

//     return filteredLogs;
//   }, [rlogs, filterValue, statusFilter]);

//   const pages = Math.ceil(filteredItems.length / rowsPerPage);

//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);

//   }, [page, filteredItems, rowsPerPage]);

//   const sortedItems = React.useMemo(() => {
//     return [...items].sort((a: Rlog, b: Rlog) => {
//       const first = a[sortDescriptor.column as keyof Rlog] as number;
//       const second = b[sortDescriptor.column as keyof Rlog] as number;
//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   const renderCell = React.useCallback((user: Rlog, columnKey: React.Key) => {
//     const cellValue = user[columnKey as keyof Rlog];

//     switch (columnKey) {
//         case "timestamp":
//             const convertedTimeStamp = convertPOSIXTimestampToLocalTime(user.timestamp)
//           return (
//             <div className="flex flex-col">
//               <p className="text-bold text-small capitalize">{(convertedTimeStamp)}</p>
//             </div>
//           );
//         case "facilityseverity":
//           return (
//             <Chip className="" color={"success"} size="sm" variant="flat">
//               {cellValue}
//             </Chip>
//           );
//         case "hostname":
//             return (
//                 <div className="flex flex-col">
//                 <p className="text-bold text-small">{cellValue}</p>
//                 </div>
//             );
//         case "ip":
//             return (
//                 <div className="flex flex-col">
//                 <p className="text-bold text-small">{cellValue}</p>
//                 </div>
//             );
//         case "syslogtag":
//           return (
//             <div className="flex flex-col">
//               <p className="text-bold text-small">{cellValue}</p>
//             </div>
//           );
//           case "logmessage":
//             const truncatedLog = truncateDescription(user.logmessage, 35);
//             return (
//               <div className="flex flex-col">
//                 <p className="text-bold text-small">{truncatedLog}</p>
//               </div>
//             );
//         case "actions":
//           return (
//             <div className="relative flex justify-center items-center gap-2">
//               <Dropdown>
//                 <DropdownTrigger>
//                   <Button isIconOnly size="sm" variant="light">
//                     <VerticalDotsIcon className="text-default-300" />
//                   </Button>
//                 </DropdownTrigger>
//                 <DropdownMenu>
//                   <DropdownItem onClick={handleDialogOpen}>View</DropdownItem>
//                   <DropdownItem>Edit</DropdownItem>
//                   <DropdownItem>Delete</DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//           );
//         default:
//           return cellValue;
//       }
//   }, []);

//   const onNextPage = React.useCallback(() => {
//     if (page < pages) {
//       setPage(page + 1);
//     }
//   }, [page, pages]);

//   const onPreviousPage = React.useCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   }, [page]);

//   const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
//     setRowsPerPage(Number(e.target.value));
//     setPage(1);
//   }, []);

//   const onSearchChange = React.useCallback((value?: string) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   const onClear = React.useCallback(()=>{
//     setFilterValue("")
//     setPage(1)
//   },[])

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-3 items-end">
//           <Input
//             isClearable
//             className="w-full sm:max-w-[44%]"
//             placeholder="Search by name..."
//             startContent={<SearchIcon />}
//             value={filterValue}
//             onClear={() => onClear()}
//             onValueChange={onSearchChange}
//           />
//           <div className="flex gap-3">
//             <Dropdown>
//               <DropdownTrigger className="hidden sm:flex">
//                 <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
//                   Columns
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Table Columns"
//                 closeOnSelect={false}
//                 selectedKeys={visibleColumns}
//                 selectionMode="multiple"
//                 onSelectionChange={setVisibleColumns}
//               >
//                 {RlogColumns.map((RlogColumn) => (
//                   <DropdownItem key={RlogColumn.uid} className="capitalize">
//                     {capitalize(RlogColumn.name)}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-default-400 text-small">Total {rlogs.length} hosts</span>
//           <label className="flex color-black items-center text-default-400 text-small">
//             Rows per page:
//             <select
//               className="bg-transparent outline-none text-default-400 text-small"
//               onChange={onRowsPerPageChange}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="15">15</option>
//             </select>
//           </label>
//         </div>
//       </div>
//     );
//   }, [
//     filterValue,
//     statusFilter,
//     visibleColumns,
//     onSearchChange,
//     onRowsPerPageChange,
//     rlogs.length,
//     hasSearchFilter,
//   ]);

//   const bottomContent = React.useMemo(() => {
//     return (
//       <div className="py-2 px-2 flex justify-between items-center">
//         <span className="w-[30%] text-small text-default-400">
//           {selectedKeys === "all"
//             ? "All items selected"
//             : `${selectedKeys.size} of ${filteredItems.length} selected`}
//         </span>
//         <Pagination
//           isCompact
//           showControls
//           showShadow
//           color="primary"
//           page={page}
//           total={pages}
//           onChange={setPage}
//         />
//         <div className="hidden sm:flex w-[30%] justify-end gap-2">
//           <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
//             Previous
//           </Button>
//           <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
//             Next
//           </Button>
//         </div>
//       </div>
//     );
//   }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

//   return (
//     <Table
//       aria-label="Example table with custom cells, pagination and sorting"
//       isHeaderSticky
//       bottomContent={bottomContent}
//       bottomContentPlacement="outside"
//       classNames={{
//         wrapper: "max-h-[382px]",
//       }}
//       selectedKeys={selectedKeys}
//       selectionMode="multiple"
//       sortDescriptor={sortDescriptor}
//       topContent={topContent}
//       topContentPlacement="outside"
//       onSelectionChange={setSelectedKeys}
//       onSortChange={setSortDescriptor}
//     >
//       <TableHeader columns={headerColumns}>
//         {(column) => (
//           <TableColumn
//             key={column.uid}
//             align={column.uid === "actions" ? "center" : "start"}
//             className={`${column.uid === "actions" ? "text-center " : ''} ${column.uid === "os" ? "pl-6" : ''}`}
//             allowsSorting={column.sortable}
//           >
//             {column.name}
//           </TableColumn>
//         )}
//       </TableHeader>
//       <TableBody emptyContent={"No hosts found"} items={sortedItems}>
//         {(item) => (
//           <TableRow key={item.id}>
//             {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }

// function severityColoring() {   
// }