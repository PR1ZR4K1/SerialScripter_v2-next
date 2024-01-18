'use client'

import React from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import HostTable from '@/components/DynamicTable';


export default function Shares() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const shares = host.shares || [];

  const sharesColumns = [
    {
      key: 'shareType',
      label: "Share Type",
      sortable: true,
    }, 
    {
      key: 'networkPath', 
      label: "Network Path"
    },
  ];

    const shareTypeColorMap: Record<string, ChipProps["color"]> = {
      nFS: "primary",
      sMB: "secondary",
  };

  return (
    <div className='h-full w-full flex flex-col items-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s Shares
          </p>
          <HostTable rows={shares} colorMap={shareTypeColorMap} columns={sharesColumns} colorField='shareType'/>
        </div>
    </div>
  )
}
