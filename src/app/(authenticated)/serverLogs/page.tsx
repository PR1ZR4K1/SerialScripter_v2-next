'use client'

import React from 'react'
import { ServerLogsTable } from './ServerLogsTable'

function serverLogs() {
  return (
    <main className='flex flex-col items-center justify-center h-screen flex-1'>
      <div className='mb-24'>
        <h1 className='text-7xl text-blue-gray-700 dark:text-gray-400'>Server Logs</h1>
      </div>
      <div className=' w-unit-9xl '>
        <ServerLogsTable />
      </div>
    </main>
  )
}

export default serverLogs