'use client'

import React, { useState } from 'react'
import { Switch } from "@material-tailwind/react";
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from "@nextui-org/react";
import HostTable from './HostTable';


export default function Services() {

  const networkColumns = [
      {
        key: 'name',
        label: "Name",
        sortable: true,
      },

      {
        key: 'port',
        label: "Port",
        sortable: true,
      }, 
      {
        key: 'description',
        label: "Description"
      },
      
      {
        key: 'status',
        label: "Status",
        sortable: true,
      }
  ];

  const systemColumns = [
      {
        key: 'name',
        label: "Name",
        sortable: true,
      },
      {
        key: 'description',
        label: "Description"
      },
      
      {
        key: 'status',
        label: "Status",
        sortable: true,
      }
  ];
  
  const networkColorMap: Record<string, ChipProps["color"]> = {
      OPEN: "success",
      FILTERED: 'warning',
      CLOSED: "danger",
  };

  const systemColorMap: Record<string, ChipProps["color"]> = {
      RUNNING: "success",
      STOPPED: "danger",
  };

  const [serviceType, setServiceType] = useState('system');
  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const networkServices = host.networkServices || [{description: '', id: 0, name: 'N/A', port: 1, status: 'OPEN', hostId: 0}];
  const systemServices = host.systemServices || [{id: 0, description: '', name: 'N/A', status: 'UP', hostId: 0}];

  const handleSwitchClick = () => {
    if (serviceType === 'system') {
      setServiceType('network');
    } else {
      setServiceType('system');
    }
  };

  return (
    <div className='h-full w-full flex flex-col items-center justify-center'>
      { serviceType === 'system' ?

        <div className='flex flex-col gap-y-20 items-center w-3/4 h-4/6'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s System Services
          </p>
          <HostTable rows={systemServices} colorMap={systemColorMap} columns={systemColumns}/>
        </div>
        :
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-4/6'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s Network Services
          </p>
          <HostTable rows={networkServices} colorMap={networkColorMap} columns={networkColumns} />
        </div>
      }
        <div className='flex justify-end w-full'>
          <Switch label={serviceType} ripple={true} color='deep-purple' crossOrigin="" defaultChecked onClick={handleSwitchClick}/>
        </div>
    </div>
  )
}
