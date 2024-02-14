"use client"
import { toast } from 'react-hot-toast';
import { ApiKey } from '@prisma/client';
import { formatCreatedAt } from '@/lib/formatTime';
import DynamicTable from '@/components/DynamicTable';
import React, { useEffect, useState } from 'react'
import { Button, Typography } from '@material-tailwind/react';
import ApiKeyForm from './apiKeyForm';

export default function ApiKeys() {
  
  const [tableView, setTableView] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [refreshCronList, setRefreshKeyList] = useState(false);

  useEffect(() => {
    async function fetchApiKeys() {
      try {
        const response = await fetch("/api/v1/add/apiKey", { next: { revalidate: 10 }, cache: 'no-store' }); // Replace with your actual API endpoint
        const data: ApiKey[] = await response.json();
        
        if (!data) {
          toast.error('Failed to retrieve apiKeys!');
          return;
        } 
        

        // New code to adjust the rows for DynamicTable
        // DynamicTable expects a deleteField function for each row and it has to be public key :(
          const adjustedKeys = data.map((key) => ({
            ...key,
            publicKey: key.id,
        }));


        setApiKeys(adjustedKeys);
        // Use hostInfo here
        console.log(data)
      } catch (error) {
          // Handle error
          console.log(error);
      }
    };

    fetchApiKeys();
    setTableView(true);
    setRefreshKeyList(false);
  
  }, [refreshCronList]);

  const keyColumns = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'key',
        label: 'Key',
    },
    {
        key: 'type',
        label: 'Type',
    },
    {
        key: 'lifetime',
        label: 'Lifetime',
    },
    { 
        key: 'deleteField',
        label: 'Delete Cron Job',
    },
  ];

  
  const handleDeleteKey = async ({ publicKey }: { publicKey: string }) => {
    toast.loading(`Removing API key...`, { duration: 2000 });

    const reqBody = JSON.stringify({ id: publicKey, action: 'delete' });
    console.log(reqBody);

    const result = await fetch("/api/v1/add/apiKey", {
      method: "POST",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
      },
      });
    
    const response = await result.json();
    
    if (response.error) {
      toast.error(`Failed to remove API key!\n${response.error}`);
    } else {
      toast.success('API Key removed successfully!');
      setTableView(true);
      setRefreshKeyList(true);
    }
  };

  return ( 
      <section className='flex flex-col w-full h-screen items-center gap-y-16 '>
          <h1 className='text-2xl font-bold mt-28'>API Keys</h1>
          <div className='w-[90%] justify-center items-center h-[60%] flex flex-col gap-y-10'>
            {tableView ? (
                    <div className='h-7xl w-4/5'>
                        <DynamicTable rows={apiKeys} columns={keyColumns} deleteField={handleDeleteKey}/>
                    </div>
                )
                : 
                (
                    <ApiKeyForm setRefreshKeyList={setRefreshKeyList} />             
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
