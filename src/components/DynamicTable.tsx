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
} from "@nextui-org/react";
import { SearchIcon } from "@/icons/SearchIcon";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { openFirewallModalTypes } from "../app/(authenticated)/[host]/Firewall";


type Row = {
  id: number;
  name?: string | null;
  port?: number;
  description?: string | null;
  status?: string;
  password?: string | null;
  publicKey?: string;
  userType?: string;
  isLocal?: string;
  shareType?: string;
  rw?: string;
  dport?: number;
  action?: string;
  hostId?: number | null;
}
type NonUndefined<T> = T extends undefined ? never : T;
type StatusOrUserType = NonUndefined<Row['status']> | NonUndefined<Row['userType'] | NonUndefined<Row['isLocal']> | NonUndefined<Row['rw']> | NonUndefined<Row['shareType']> | NonUndefined<Row['action']> >;

type ColorMap = {
  [key in StatusOrUserType]: ChipProps["color"];
};


type Columns = {
  key: string;
  label: string;
  sortable?: boolean;
}

type NonNullableKeyOf<T> = Exclude<keyof T, undefined | null>;
type ValidColorField = NonNullableKeyOf<Row>;
type DeleteFieldType = {
  publicKey: string;
}

interface HostTableTypes {
  rows: Row[];
  colorMap?: ColorMap;
  columns: Columns[];
  editField?: ({ action, dport, description }: openFirewallModalTypes) => void;
  deleteField?: ({publicKey}: DeleteFieldType) => Promise<void>;
  colorField?: ValidColorField;
  colorField2?: ValidColorField;
}


export default function HostTable({rows, colorMap, columns, editField, deleteField, colorField, colorField2}: HostTableTypes) {

  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));

  const hasSearchFilter = Boolean(filterValue);

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
      direction: "ascending",
  });

  const filteredItems = React.useMemo(() => {
    let filteredRows = [...rows];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter((row) => {
        // Determine which property to use for filtering

        if (row.name) {
          // Perform the filtering using the chosen property
          return (row['name'] as string).toLowerCase().includes(filterValue.toLowerCase());
        }

        // If neither 'name' nor 'username' is present, the row does not match the filter
        return false;
      });
    }


      return filteredRows;
  }, [rows, filterValue, hasSearchFilter]);

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

          const firstValue = a[sortDescriptor.column as keyof Row];
          const secondValue = b[sortDescriptor.column as keyof Row];

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
    return (
            <div className="flex flex-col gap-4">
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
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {rows.length} rows</span>
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
  }, [filterValue, onClear, onRowsPerPageChange, onSearchChange, rows.length]);

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
          table: 'dark:bg-[#141B29] dark:border-[#141B29] min-h-[250px] max-h-[382px]',
          emptyWrapper: 'dark:bg-[#141B29]',
          base: 'dark:bg-transparent',
      }}
    >
      <TableHeader columns={columns}>
        {(column) => 
          <TableColumn 
            key={column.key} 
            allowsSorting={column.sortable}
            className={`${column.key === colorField || column.key === colorField2 || column.key === 'editField' || column.key === 'deleteField' ? "text-center " : ''}`}
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
                {columnKey === colorField && item[colorField]  && colorMap ? (
                    <div className="flex items-center justify-center ">
                      <Chip className="capitalize" color={colorMap[item[colorField] as StatusOrUserType]} size="sm" variant="flat">
                        {item[colorField]  as StatusOrUserType}
                      </Chip>
                    </div>
                  ) : columnKey === colorField2 && item[colorField2] && colorMap ? (
                    <div className="flex items-center justify-center">
                      <Chip className="capitalize" color={colorMap[item[colorField2] as StatusOrUserType]} size="sm" variant="flat">
                        {item[colorField2]  as StatusOrUserType}
                      </Chip>
                    </div>
                  ) : columnKey === 'editField' ? (
                    <span className="flex items-center justify-center text-center text-lg text-primary active:opacity-50 bg-transparent">
                        <PencilSquareIcon className="cursor-pointer" onClick={() => editField && editField({ action: item.action, dport: item.dport, description: item.description })} width={25} height={25} />
                    </span>
                  ) : columnKey === 'deleteField' ? (
                    <span className="flex items-center justify-center text-center text-lg text-red-700 active:opacity-50 bg-transparent">
                        <TrashIcon className="cursor-pointer" onClick={() => deleteField && item.publicKey && deleteField({publicKey: item.publicKey})} width={25} height={25} />
                    </span>
                  ) 
                  : columnKey === 'publicKey' ? 
                  (
                    <div className="break-words w-96">
                      {(() => {
                        const gay = item.publicKey?.split(' ') || ['', '', ''];
                        return `${gay[0]} ${gay[2]}`
                      }) ()}
                    </div>
                  )
                  :
                  (
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