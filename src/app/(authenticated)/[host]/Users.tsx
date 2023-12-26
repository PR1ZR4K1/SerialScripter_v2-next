'use client'

import React from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import HostTable from './HostTable';


export default function Users() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const users = host.userAccounts || [{hostId: 0, id: 0, password: 'password', name: 'god', userType: 'PRIVILEGED'}]

  const userColumns = [
    {
      key: 'name',
      label: "Name",
      sortable: true,
    }, 
    {
      key: 'password', 
      label: "Password"
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
    <div className='h-full w-full flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-4/6'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s Users
          </p>
          <HostTable rows={users} colorMap={userTypeColorMap} columns={userColumns}/>
        </div>
    </div>
  )
}
