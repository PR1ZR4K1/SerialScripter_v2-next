'use client'

import React from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import HostTable from './HostTable';
import { UserAccount } from '@prisma/client'


export default function Users() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  type UserAccountWithGroupString = Omit<UserAccount, 'groups'> & { groups: string };

  const users = host.userAccounts || [];

  const usersWithGroupString: UserAccountWithGroupString[] = users.map(user => {
    // Use the spread operator to copy other properties of the user
    let newUser: UserAccountWithGroupString = { ...user, groups: user.groups.join(', ') };
    return newUser;
  });

  const userColumns = [
    {
      key: 'name',
      label: "Name",
      sortable: true,
    }, 
    {
      key: 'isLocal',
      label: "Is Local",
      sortable: true,
    }, 
    {
      key: 'uid',
      label: "User ID",
      sortable: true,
    }, 
    {
      key: 'gid',
      label: "Group ID",
      sortable: true,
    }, 
    {
      key: 'shell',
      label: "Shell",
      sortable: true,
    }, 
    {
      key: 'groups',
      label: "Groups",
      sortable: true,
    }, 
    {
      key: 'userType', 
      label: "User Type",
      sortable: true,
    }
  ];

    const userTypeColorMap: Record<string, ChipProps["color"]> = {
      USER: "success",
      PRIVILEGED: "danger",
  };

  return (
    <div className='h-full w-full flex flex-col items-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s Users
          </p>
          <HostTable rows={usersWithGroupString} colorMap={userTypeColorMap} columns={userColumns}/>
        </div>
    </div>
  )
}
