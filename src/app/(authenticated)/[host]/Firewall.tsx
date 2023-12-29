import React from 'react'
import HostTable from './HostTable'
import { useHostsStore } from '@/store/HostsStore';

function Firewall() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const disks = host.disks || [{hostId: 0, id: 0, mountPoint: '/', name: 'god', availableSpace: 123, filesystem: 'ntfs', totalSpace: 12345}]

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
            {host.hostname}&apos;s Firewall Configuration
          </p>
          <HostTable rows={disks} columns={diskColumns}/>
        </div>
    </div>
  )
}

export default Firewall