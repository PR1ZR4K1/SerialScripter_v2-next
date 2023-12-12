"use client"
import CronTable from './CronTable'

import React from 'react'
import { Button, Typography } from '@material-tailwind/react';
import CreateNewCronJobModal from './CreateNewCronJobModal';

export default function Cron() {
  return ( 
      <section className='flex flex-col w-full h-screen items-center'>
          <h1 className='text-7xl text-blue-gray-700 dark:text-gray-400 mt-5'>Cron</h1>
          <div className='flex justify-start w-full h-30'>
              <CreateNewCronJobModal/>
          </div>
          <div className='w-[90%] flex justify-center h-full mt-5 relative'>
              <CronTable/>
          </div>
      </section>
  );  
}
