import React from 'react'
import ScriptingHubTable from '@/components/ScriptingHubTable';
import { columns, rows } from './scriptData';

function Page() {
  return (
    <div className='flex flex-col gap-y-16 justify-center items-center w-full h-screen'>
        <h1 className='text-5xl'>Linux Playbooks</h1>
        <div className='w-1/2'>
            <ScriptingHubTable columns={columns} rows={rows} />
        </div>
    </div>
  )
}

export default Page


