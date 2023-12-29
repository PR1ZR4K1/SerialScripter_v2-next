// import { useHostsStore } from "@/store/HostsStore";
// import React, { useMemo } from "react";
// import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, SortDescriptor, ChipProps, Chip} from "@nextui-org/react";
// import { UserAccount } from "@prisma/client";
 
// interface UsersTableTypes {
//   users: UserAccount[];
// } 

// export default function UsersTable({users}: UsersTableTypes) {

//   const columns = [
//     {
//       key: 'username',
//       label: "Username",
//       sortable: true,
//     }, 
//     {
//       key: 'password', 
//       label: "Password"
//     },
//     {
//       key: 'userType', 
//       label: "User Type",
//       sortable: true,
//     }
//   ];

//   const userTypeColorMap: Record<string, ChipProps["color"]> = {
//       USER: "success",
//       PRIVILEGED: "danger",
//   };

//   const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
//       direction: "ascending",
//   });

// const sortedUsers = useMemo(() => {
//     return [...users].sort((a, b) => {
//         // Assume the column values are strings
//         const first = a[sortDescriptor.column as keyof UserAccount] as string;
//         const second = b[sortDescriptor.column as keyof UserAccount] as string;

//         let cmp;

//         // Compare strings in a case-insensitive manner
//         if (typeof first === 'string' && typeof second === 'string') {
//             // String sort
//             cmp = first.localeCompare(second, undefined, { sensitivity: 'base' });
//         }
//         else {
//             // Fallback or throw an error if the types are not consistent or as expected
//             // console.error('Inconsistent or unexpected data types for sorting');
//             cmp = 0; // Or handle this case as you see fit
//         }

//         // Adjust for ascending or descending order
//         return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
// }, [sortDescriptor, users]);

//   return (
//     <Table 
//       selectionMode="multiple" 
//       aria-labelledby="Users Table"
//       sortDescriptor={sortDescriptor}
//       onSortChange={setSortDescriptor}
//       classNames={{
//           // th: "dark:bg-[#24344E]",
//           td: "dark:bg-[#141B29]",
//           wrapper: "max-h-[382px] dark:bg-[#141B29]",
//           table: 'dark:bg-[#141B29] dark:border-[#141B29]',
//           emptyWrapper: 'dark:bg-[#141B29]',
//           base: 'dark:bg-transparent',
//       }}
//     >
//       <TableHeader columns={columns}>
//         {(column) => 
//           <TableColumn 
//             key={column.key}
//             allowsSorting={column.sortable}
//             className={`${column.key === "userType" ? "text-center " : ''}`}
//           >
//             {column.label}
//           </TableColumn>
//         }
//       </TableHeader>
//       <TableBody items={sortedUsers} emptyContent={"No users to display."}>
//         {(item) => (
//           <TableRow key={item.id}>
//             {(columnKey) => 
//               <TableCell className="">
//                 {columnKey === 'userType' ? (
//                   <div className="flex items-center justify-center">
//                     <Chip className="capitalize" color={userTypeColorMap[item.userType]} size="sm" variant="flat">
//                       {item.userType}
//                     </Chip>
//                   </div>
//                 ) 
//                 : 
//                 getKeyValue(item, columnKey)}
//               </TableCell>  
//             }
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }