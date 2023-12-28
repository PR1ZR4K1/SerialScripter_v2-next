'use client'

import React from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import HostTable from './HostTable';


export default function Disks() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const disks = host.disks || [{hostId: 0, id: 0, mountPoint: '/', name: 'god', availableSpace: 123, filesystem: 'ntfs', totalSpace: 12345}]

    // id: number;
    // name: string;
    // mountPoint: string;
    // filesystem: string;
    // totalSpace: number;
    // availableSpace: number;
    // hostId: number;

  const diskColumns = [
    {
      key: 'name',
      label: "Name",
      sortable: true,
    }, 
    {
      key: 'mountPoint', 
      label: "Mount Point",
      sortable: true,
    },
    {
      key: 'filesystem', 
      label: "File System",
      sortable: true,
    },
    {
      key: 'totalSpace', 
      label: "Total Space",
      sortable: true,
    },
    {
      key: 'availableSpace', 
      label: "Available Space",
      sortable: true,
    }
  ];

  return (
    <div className='h-full w-full flex flex-col items-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s Disks
          </p>
          <HostTable rows={disks} columns={diskColumns}/>
        </div>
    </div>
  )
}
