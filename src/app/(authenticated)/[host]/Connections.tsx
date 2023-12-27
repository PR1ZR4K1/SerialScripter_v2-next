'use client'

import React from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import HostTable from './HostTable';


export default function Connections() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const connections = host.connections || [];

  const connectionsColumns = [
    {
      key: 'name',
      label: "Name",
      sortable: true,
    }, 
    {
      key: 'localAddress', 
      label: "Local Address"
    },
    {
      key: 'remoteAddress', 
      label: "Remote Address"
    },
    {
      key: 'pid', 
      label: "PID"
    },
    {
      key: 'protocol', 
      label: "Protocol"
    },
    {
      key: 'state', 
      label: "State"
    },
  ];

    const userTypeColorMap: Record<string, ChipProps["color"]> = {
      USER: "success",
      PRIVILEGED: "danger",
  };

  return (
    <div className='h-full w-full flex flex-col items-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s Connections
          </p>
          <HostTable rows={connections} colorMap={userTypeColorMap} columns={connectionsColumns}/>
        </div>
    </div>
  )
}
