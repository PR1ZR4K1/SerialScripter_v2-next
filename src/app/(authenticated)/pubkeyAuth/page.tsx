'use client';
import { useEffect, useState } from 'react';
import Table from '@/components/DynamicTable';
import { SshKey } from '@prisma/client';
import { Button } from '@nextui-org/react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PublicKeyForm from './PublicKeyForm';
import toast from 'react-hot-toast';

export default function Page() {

  const [publicKeys, setPublicKeys] = useState<SshKey[]>([]);
  const [tableView, setTableView] = useState(true);
  const [nameValue, setNameValue] = useState('');
  const [keyValue, setKeyValue] = useState('');   
  
  useEffect(() => {
    async function fetchKeys() {
      try {
        const response = await fetch("/api/v1/get/sshKeys", { next: { revalidate: 10 }, cache: 'no-store' }); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: SshKey[] = await response.json();
        
        
        if (!data) {
            return;
        }

        const shortenedKeys = data.map(key => {
          return {
            ...key,
            publicKey: key.publicKey.substring(0, 12)
          };
        });
        setPublicKeys(shortenedKeys);
        // Use hostInfo here
      } catch (error) {
          // Handle error
          console.log(error);
      }
    };

    fetchKeys();
  
  }, [setPublicKeys]);

  const keysColumns = [
    {
      key: 'name',
      label: "Name",
      sortable: true,
    }, 
    {
      key: 'publicKey', 
      label: "Public Key"
    },
    {
      key: 'deleteField', 
      label: "Delete Key"
    },
  ];

  type updateKeysType = {
    publicKey: string;
    os: 'linux' | 'windows';
    sshState: 'present' | 'absent';
  }
  
  const updateKeys = async ({ publicKey, os, sshState }: updateKeysType) => {
    try {
      const result = await fetch(`/api/v1/get/${os}Hosts`, { next: { revalidate: 10 }, cache: 'no-store' });
      const hosts = await result.json();

      if (!hosts) {
        toast.error(`Failed to get ${os} hosts from db!\n${hosts.error}`);
        return { successes: 0, total: 0 };
      }

      let successes = 0;
      toast.loading(`Updating authorized_keys files on ${os} hosts...`, { duration: 1500 });

      for (const host of hosts) {
        const result = await fetch(`/api/v1/ansibleDeploy/${os}`, {
          method: "POST",
          body: JSON.stringify({ host: host.ip, playbook: `ssh_${os}.yml`, extra_vars: `ansible_password=${host.password} ssh_state=${sshState} ssh_public_key=${publicKey}` }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (result.ok) {
          successes++;
        }
      }

      toast.success(`Successfully updated authorized_keys files on ${successes}/${hosts.length} ${os} hosts!`);
      
    } catch (error) {
      toast.error(`An error occurred: ${error}`);
    }
  };
  
  const handleDeleteKey = async ({publicKey}: {publicKey: string}) => {
    const result = await fetch("/api/v1/delete/sshKey", {
      method: "POST",
      body: JSON.stringify({ publicKey: publicKey }),
      headers: {
        "Content-Type": "application/json",
      },
      });
    
    const response = await result.json();
    
    if (response.error) {
      toast.error(`Failed to delete public key from db!\n${response.error}`);
    } else {
      toast.success('Public key deleted from db successfully!');
      await updateKeys({ publicKey: publicKey, os: 'linux', sshState: 'absent' });
      await updateKeys({ publicKey: publicKey, os: 'windows', sshState: 'absent' });
      setTableView(true);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetch("/api/v1/add/sshKey", {
        method: "POST",
        body: JSON.stringify({ name: nameValue, publicKey: keyValue }),
        headers: {
          "Content-Type": "application/json",
        },
    });
     
    const response = await result.json();
    
    if (response.error) {
      toast.error(`Failed to add public key to db!\n${response.error}`);
      
    } else {
      toast.success('Public key added to db successfully!');
      
      await updateKeys({ publicKey: keyValue, os: 'linux', sshState: 'present' });
      
      await updateKeys({ publicKey: keyValue, os: 'windows', sshState: 'present'});  
      
      setTableView(true);
    }
  }

  return (
    <section className='flex flex-col w-full h-screen items-center'>
      <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4 mt-16'>
        <p className='text-2xl font-bold'>
            Public Keys
        </p>
        { tableView ? (
        <div className='flex flex-col w-full gap-y-4 items-center justify-center'>
            <Table rows={publicKeys} columns={keysColumns} deleteField={handleDeleteKey}/>
            <div className='flex w-full justify-end'>
            <Button
                className='w-1/6'
                color='secondary'
                variant='ghost'
                endContent={<ArrowRightIcon width={15} height={15} />}
                onClick={() => {
                    setTableView(false)
                }}
            >
                Add Public Key
            </Button>
            </div>
        </div>
        ) 
        : 
        (
        <form onSubmit={handleSubmit} className='flex flex-col w-full gap-y-4 items-center justify-center'>
            <PublicKeyForm name={nameValue} setName={setNameValue} publicKey={keyValue} setPublicKey={setKeyValue}/>
            <div className='flex w-full justify-between'>
            <Button
                className='w-1/6'
                color='secondary'
                variant='ghost'
                startContent={<ArrowLeftIcon width={15} height={15} />}
                onClick={() => {
                    setTableView(true)
                }}
            >
                View Public Keys
            </Button>
            <Button
                type='submit'
                className='w-1/6'
                color='secondary'
                variant='shadow'
                endContent={<CheckCircleIcon width={15} height={15} />}
            >
                Confirm
            </Button>
            </div>
        </form>
                            
        )}
        </div>
    </section>
  )
};
