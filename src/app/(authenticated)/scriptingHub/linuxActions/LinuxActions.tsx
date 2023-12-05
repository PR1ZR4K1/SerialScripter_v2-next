'use client';

import { useEffect, useState } from 'react'
import ScriptingHubTable from '@/components/AnsiblePlaybooksTable';
import { columns, rows } from './scriptDataLinux';
import { Button } from '@nextui-org/react';
import { ArrowSmallLeftIcon, ArrowSmallRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import AnsibleHostsTable from '@/components/AnsibleHostsTable';
import { useScriptingHubStore } from '@/store/ScriptingHubStore';
import { deployAnsiblePlaybooks } from '@/lib/AnsibleHelper';
import { useHostsStore } from '@/store/HostsStore';



export default function LinuxActions() {
  const [view, setView] = useState('scripts');

  const [selectedKeysLinuxHosts, selectedKeysLinuxPlaybooks, linuxHosts, getLinuxHosts] = useScriptingHubStore((state) => [
    state.selectedKeysLinuxHosts,
    state.selectedKeysLinuxPlaybooks,
    state.linuxHosts,
    state.getLinuxHosts,
  ])

  useEffect(() => {
    getLinuxHosts();
  }, [getLinuxHosts])

  return (
    view === 'scripts' ? (
        <div className=''>    
          <div className='flex flex-col items-center justify-center gap-y-16'>
            <h1 className='text-5xl'>Linux Playbooks</h1>
            <div className=''>
                <ScriptingHubTable os='linux' columns={columns} rows={rows} />
            </div>
          </div>

          <div className='flex justify-end items-end pt-5'>
            <Button onClick={() => setView('hosts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowSmallRightIcon width={15} height={15} />}>
              Select Hosts
            </Button>
          </div>
        </div>
        )
        :
        (
        <div className=' '>    
          <div className='flex flex-col items-center justify-center gap-y-16'>
            <h1 className='text-5xl'>Linux Hosts</h1>
            <AnsibleHostsTable os='linux' />
          </div>

          <div className='flex justify-between items-end pt-5'>
            <Button onClick={() => setView('scripts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowSmallLeftIcon width={15} height={15} />}>
              Select Playbooks
            </Button>
            <Button onClick={() => deployAnsiblePlaybooks({ selectedHosts: selectedKeysLinuxHosts, selectedPlaybooks: selectedKeysLinuxPlaybooks, rows: rows, hosts: linuxHosts, os: 'linux' })} className='hover:shadow-black hover:shadow-lg' color='danger' endContent={<RocketLaunchIcon width={15} height={15} />} >
              Deploy Baby!
            </Button>
          </div>
        </div>
        )
    
  )
}
