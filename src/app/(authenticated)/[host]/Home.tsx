import { useHostsStore } from '@/store/HostsStore'
import Image from 'next/image';
import React from 'react'
import { CpuChipIcon, CircleStackIcon, WifiIcon, UserIcon, Cog6ToothIcon,  } from '@heroicons/react/24/outline';
import { LuMemoryStick } from "react-icons/lu";
import { BsDoorOpen } from "react-icons/bs";
import { PiCircuitryThin } from "react-icons/pi";
import { CiRouter } from "react-icons/ci";
import { CgEthernet } from "react-icons/cg";


export default function Home() {
  
  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  let imgSrc = '/assets/router.png'; // Default image
  let totalPrivilegedUsers = 0;
  let totalServices = 0;
  let totalPorts = 0;

  try {
    if (host.os) {
        const osName = host.os || 'unknown'; // Fallback to 'unknown' if os or os.name is undefined  
        if (osName.toLowerCase() === 'windows') {
            imgSrc = '/assets/windows.png';
        } else if (osName.toLowerCase() === 'linux') {
            imgSrc = '/assets/linux.png';
        }  

        if (host.userAccounts) {
            totalPrivilegedUsers = host.userAccounts.filter((user) => user.isAdmin).length;
        }

        if (host.networkServices) {
            totalServices += host.networkServices.length;
            totalPorts = host.networkServices.filter((service) => service.port).length;
        }

        if (host.systemServices) {
            totalServices += host.systemServices.length;
        }
    }

    } catch (error) {
        console.log('dont know what to do w this', error)
    }
    
  return (
    <div className='flex w-[95%] h-[90%] items-start gap-x-6'>
        <div className='flex h-full justify-center items-center w-1/5 bg-white/70 dark:bg-[#00477A] rounded-xl '>
           <div className='flex flex-col h-1/2 w-full my-8 px-4 gap-y-6 relative items-center justify-center'>
                <div className='flex justify-center'>
                    <Image
                        alt='OS Img'
                        width={70}
                        height={70}
                        src={imgSrc}
                        priority
                    />
                </div>

                <div className='font-bold text-center'>
                    {host.version || 'N/A'}
                </div>
                <div className='flex flex-col justify-evenly text-sm h-full font-medium'>

                    <div className='flex items-center gap-x-2'>
                        <CpuChipIcon height={30} width={30} className='text-blue-600 dark:text-[#1D9FE4]'/>
                        {`${host.cores || 'N/A'} Cores`}
                         
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <LuMemoryStick className='h-[30px] w-[30px] text-blue-600 dark:text-[#1D9FE4]' height={30} width={30}/>
                        {`${host.memory || 'N/A'} MB`}
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <CircleStackIcon height={30} width={30} className='text-blue-600 dark:text-[#1D9FE4]' />
                        {`${host.disks?.length || 'N/A'} Disks`}
                    </div>
                </div>
            </div>
        </div>
        <div className='flex flex-col w-4/5 h-full items-center gap-y-6'>
            <div className='flex flex-1 w-full justify-center items-center rounded-xl bg-white/70 dark:bg-[#00477A]'>
                <div className='flex w-[90%] h-[90%] relative'>

                    {/* divider positioned absolutely in the middle of big box */}
                    <div className='absolute top-1/2 -translate-y-1/2 left-1/2 border-1 border-black/30 rounded-full h-full' />

                    <div className='flex items-center justify-center w-1/2 relative'>
                        <div className='flex relative font-medium justify-center items-center gap-y-6 flex-col h-full'>
                            <div className='absolute top-0 left-1/2 -translate-x-1/2 font-semibold whitespace-nowrap' >
                                Network Statistics
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <WifiIcon height={20} width={20}/>
                                IP Address: {host.ip}
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <PiCircuitryThin className='h-5 w-5'/>
                                MAC Address: {host.macAddress || 'N/A'}
                            </div>
                            <div className='flex justify-center items-center gap-x-2 pb-1'>
                                <CiRouter className='h-6 w-6'/>
                                DHCP: {host.dhcp ? 'True' : 'False'}
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <BsDoorOpen className='h-5 w-5'/>
                                Default Gateway: {host.gateway || 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className='flex w-1/2 pl-12 items-center justify-center '>
                        <div className='flex relative h-full flex-col gap-y-6 justify-center items-center font-medium'> 
                            <div className='absolute top-0 left-1/2 -translate-x-1/2 font-semibold whitespace-nowrap' >
                                General Information
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <UserIcon height={20} width={20} className='text-red-900'/>
                                Total Privileged Users: {totalPrivilegedUsers || 'N/A'}
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <UserIcon height={20} width={20}/>
                                Total Users: {host.userAccounts?.length || 'N/A'}
                            </div>

                            <div className='flex justify-center items-center gap-x-2 pb-1'>
                                <Cog6ToothIcon height={20} width={20} className=''/>
                                Total Running Services: {totalServices || 'N/A'}
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <CgEthernet className='h-5 w-5'/>
                                Total Ports: {totalPorts || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-y-32 w-full rounded-xl bg-white/70 dark:bg-[#00477A] justify-start items-center'>
                <div className='pt-6'>
                    Scheduled Tasks
                </div>
                <div>
                    task stuff...
                </div>
            </div>
        </div>
    </div>
  )
}
