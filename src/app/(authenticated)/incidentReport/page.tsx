"use client"
import React, { useEffect, useState } from 'react'
import IncidentForm from './incidentForm';
import { Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { Incident } from '@prisma/client';
import { formatCreatedAt } from '@/lib/formatTime';
import DynamicTable from '@/components/DynamicTable';

export type TableIncidentType = Omit<Incident, 'createdAt' | 'tags'> & { createdAt: string, tags: string }; 

export default function Cron() {
  
  const [tableView, setTableView] = useState(true);
  const [incidents, setIncidents] = useState<TableIncidentType[]>([]);
  const [refreshIncidentList, setRefreshIncidentList] = useState(false);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await fetch("/api/v1/get/incidents", { next: { revalidate: 10 }, cache: 'no-store' }); // Replace with your actual API endpoint
  
        const data: Incident[] = await response.json();
        
        if (!data) {
          toast.error('Failed to retrieve incidents!');
          return;
        }
  
        const moddedIncidents: TableIncidentType[] = data.map(incident => {
          return {
            ...incident,
            tags: incident.tags.join(', '),
            createdAt: formatCreatedAt(incident.createdAt)
          };
        });
        
        setIncidents(moddedIncidents);
        // Use hostInfo here
      } catch (error) {
          // Handle error
          console.log(error);
      }
    };

    fetchIncidents();
    setTableView(true);
    setRefreshIncidentList(false);
  
  }, [refreshIncidentList]);

  const incidentColumns = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'ip',
        label: 'IP',
    },
    {
        key: 'hostname',
        label: 'Hostname',
    },
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'description',
        label: 'Description',
    },
    {
        key: 'tags',
        label: 'Tags',
    },
    {
        key: 'createdAt',
        label: 'Created At',
    },
    {
        key: 'downloadAttachment',
        label: 'Download Attachment',
    },
  ];

  const downloadAttachment = async ({id}: {id: number}) => {
  
    try {
        const response = await fetch(`/api/v1/get/incidentAttachment/${id}`, { next: { revalidate: 10 }, cache: 'no-store' }); // Replace with your actual API endpoint
        
        if (!response.ok) {
          toast.error('Failed to retrieve incident attachment!');
          return;
        }

    // Assuming the server sets Content-Disposition header with filename
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'download';
        if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
        }
        }

        // Create a blob from the response data
        const blob = await response.blob();
        
        // Create a link and set the URL to the blob
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename; // Set the default filename for the download
        document.body.appendChild(link); // Append to the document

        // Trigger download and then remove the link
        link.click();
        document.body.removeChild(link);
        
        // Optional: free up memory by revoking the object URL
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error('Error downloading the file:', error);
        toast.error('Error downloading the file');
        return;
    }
  };

  return ( 
      <section className='flex flex-col w-full h-screen items-center gap-y-16 '>
          <h1 className='text-2xl font-bold mt-28'>Report an Incident</h1>
          <div className='w-[90%] justify-center items-center h-[60%] flex flex-col gap-y-10'>
            {tableView ? (
                    <div className='h-7xl w-4/5'>
                        <DynamicTable rows={incidents} columns={incidentColumns} downloadAttachment={downloadAttachment}/>
                    </div>
                )
                : 
                (
                    <IncidentForm setRefreshIncidentList={setRefreshIncidentList}/>              
                )
            }
            <Button
                className='w-1/6'
                color='secondary'
                variant='ghost'
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
