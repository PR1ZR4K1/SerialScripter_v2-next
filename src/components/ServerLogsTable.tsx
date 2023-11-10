'use client'
import { serverLogs } from "@/data/data";
import { Button, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import React from "react";

type ServerLog = {
  name: string;
  timestamp: string;
  status: 'signed in' | 'signed out';
}

const PAGE_SIZE = 5; // or whatever size you want

function getPageData(pageNumber: number, pageSize = PAGE_SIZE) {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  const nextCursor = (pageNumber * PAGE_SIZE) < serverLogs.length ? pageNumber + 1 : null;

  return {
    data: serverLogs.slice(start, end),
    nextCursor
  };
}

export function ServerLogsTable() {

  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  let list = useAsyncList({
    async load({signal, cursor}) {
      if (cursor) {
        setPage((prev) => prev + 1);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const { data, nextCursor } = await getPageData(page);

      if (!cursor) {
        setIsLoading(false);
      }


      return {
        items: data,
        cursor: nextCursor ? nextCursor.toString() : undefined,
      };
    },
  });

  const hasMore = page < 9;

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with client side sorting"
      bottomContent={
        hasMore && !isLoading ? (
          <div className="flex w-full justify-center">
            <Button isDisabled={list.isLoading} variant="flat" onPress={list.loadMore}>
              {list.isLoading && <Spinner color="white" size="sm" />}
              Load More
            </Button>
          </div>
        ) : null
      }
      classNames={{
        td: "dark:bg-[#141B29]",
        wrapper: "max-h-[382px] dark:bg-[#141B29]",
        table: 'min-h-[420px] dark:bg-[#141B29] dark:border-[#141B29]',
        emptyWrapper: 'dark:bg-[#141B29]',
        base: 'max-h-[520px] dark:bg-transparent',
      }}
    >
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="timestamp">Time Stamp</TableColumn>
        <TableColumn key="status">Status</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={list.items as ServerLog[]}
        loadingContent={<Spinner label="Loading..." />}
        >
        {(item: ServerLog) => (
          <TableRow key={item.name}>
            { (columnKey) => 
              <TableCell>
                {
                  columnKey === "status" ? 
                    <Chip className="capitalize" color={item.status === 'signed in' ? "success" : "danger"} size="sm" variant="flat">
                      {item.status}
                    </Chip>
                  :
                    getKeyValue(item, columnKey)

                }
              </TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

}