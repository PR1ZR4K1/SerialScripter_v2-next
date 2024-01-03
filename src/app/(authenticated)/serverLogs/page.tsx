'use client'
import React, {useEffect, useState} from 'react'
import ServerLogsTable from './ServerLogsTable'
import { getServerLogs } from '@/lib/ServerLogHelper'
import { Prisma } from '@prisma/client';
import { formatCreatedAt } from '@/lib/formatTime';


type ServerLog = Omit<Prisma.ServerLogCreateManyInput, 'timestamp'> & {
  createdAt: string;
};

export default function ServerLogs() {
  const [serverLogs, setServerLogs] = useState<ServerLog[]>([]);

  useEffect(() => {
    async function fetchServerLogs() {
      try {
        const serverLogsDB: Prisma.ServerLogCreateManyInput[] = await getServerLogs();
        // console.log(serverLogs)
        const formattedServerLogs: ServerLog[] = serverLogsDB.map((serverLog) => {
          return {
            ...serverLog,
            createdAt: formatCreatedAt(serverLog.createdAt! as Date),
          }
        });
        setServerLogs(formattedServerLogs)
      } catch (error) {
        console.log(error)
      }
    }

    fetchServerLogs();

  }, [])

  return (
    <div className='h-screen w-full flex flex-col items-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4 mt-36'>
          <p className='text-4xl font-bold'>
            Server Logs
          </p>
          <ServerLogsTable serverLogs={serverLogs}/>
        </div>
    </div>
  )
}
