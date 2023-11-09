'use client';

import { useState } from 'react'
import ScriptingHubTable from '@/components/ScriptingHubTable';
import { columns, rows } from './scriptData';
import { Button } from '@nextui-org/react';
import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';



export default function LinuxActions() {
  const [view, setView] = useState('scripts');

  return (
    view === 'scripts' ? (
        <div className=''>    
          <div className='flex flex-col items-center justify-center gap-y-16'>
            <h1 className='text-5xl'>Linux Playbooks</h1>
            <div className=''>
                <ScriptingHubTable columns={columns} rows={rows} />
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
          <h1 className='text-5xl'>Linux Hosts</h1>
        )
    
  )
}
