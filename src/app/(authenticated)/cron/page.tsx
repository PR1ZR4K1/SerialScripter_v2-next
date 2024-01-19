"use client"
import CronForm from './CronForm';
import { toast } from 'react-hot-toast';
import { CronJob } from '@prisma/client';
import { formatCreatedAt } from '@/lib/formatTime';
import DynamicTable from '@/components/DynamicTable';
import React, { useEffect, useState } from 'react'
import { Button, Typography } from '@material-tailwind/react';

export default function Cron() {
  
  const [tableView, setTableView] = useState(true);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [refreshCronList, setRefreshCronList] = useState(false);

  useEffect(() => {
    async function fetchCronJobs() {
      try {
        const response = await fetch("/api/v1/cronJob", { next: { revalidate: 10 }, cache: 'no-store' }); // Replace with your actual API endpoint
  
        const data: { tasks: CronJob[] } = await response.json();
        
        if (!data || !data.tasks) {
          toast.error('Failed to retrieve cron jobs!');
          return;
        } 
        

        // New code to adjust the rows for DynamicTable
        // DynamicTable expects a deleteField function for each row and it has to be public key :(
        const adjustedCronJobs = data.tasks.map((job) => ({
            ...job,
            publicKey: job.name,
        }));


        setCronJobs(adjustedCronJobs);
        // Use hostInfo here
        console.log(data)
      } catch (error) {
          // Handle error
          console.log(error);
      }
    };

    fetchCronJobs();
    setTableView(true);
    setRefreshCronList(false);
  
  }, [refreshCronList]);

  const cronColumns = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'command',
        label: 'Command',
    },
    {
        key: 'schedule',
        label: 'Schedule',
    },
    { 
        key: 'lastOutput',
        label: 'Command Output',
    },
    { 
        key: 'deleteField',
        label: 'Delete Cron Job',
    },
  ];

  
  const handleDeleteKey = async ({ publicKey }: { publicKey: string }) => {
    toast.loading(`Removing cron job...`, { duration: 2000 });
    console.log("We are doing stuff");

    const reqBody = JSON.stringify({ name: publicKey, action: 'stop' });
    console.log(reqBody);

    const result = await fetch("/api/v1/cronJob", {
      method: "POST",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
      },
      });
    
    const response = await result.json();
    
    if (response.error) {
      toast.error(`Failed to remove cronjob!\n${response.error}`);
    } else {
      toast.success('Cron job removed successfully!');
      setTableView(true);
      setRefreshCronList(true);
    }
  };

  return ( 
      <section className='flex flex-col w-full h-screen items-center gap-y-16 '>
          <h1 className='text-2xl font-bold mt-28'>Cron Jobs</h1>
          <div className='w-[90%] justify-center items-center h-[60%] flex flex-col gap-y-10'>
            {tableView ? (
                    <div className='h-7xl w-4/5'>
                        <DynamicTable rows={cronJobs} columns={cronColumns} deleteField={handleDeleteKey}/>
                    </div>
                )
                : 
                (
                    <CronForm setRefreshCronList={setRefreshCronList}/>              
                )
            }
            <Button
                className='w-1/6'
                // color='secondary'
                // variant='ghost'
                onClick={() => {
                    setTableView(!tableView)
                }}
            >
                Switch View
            </Button>
          </div>
      </section>
  );  
}
