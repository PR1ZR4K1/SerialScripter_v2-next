import { useHostsStore } from '@/store/HostsStore'
import Image from 'next/image';
import React from 'react'
import { CpuChipIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { LuMemoryStick } from "react-icons/lu";


export default function Home() {
  
  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  let imgSrc = '/assets/router.png'; // Default image

  if (host.os) {
      const osName = host.os?.name || 'unknown'; // Fallback to 'unknown' if os or os.name is undefined  
      if (osName.toLowerCase() === 'windows') {
          imgSrc = '/assets/windows.png';
      } else if (osName.toLowerCase() === 'linux') {
          imgSrc = '/assets/linux.png';
      }  
  }
  
  return (
    <div className='flex w-[95%] h-[90%] items-start gap-x-6'>
        <div className='flex h-full justify-center items-center w-1/5 bg-white/70 rounded-xl '>
           <div className='flex flex-col h-1/2 w-full my-8 px-4 gap-y-6 relative items-center justify-center'>
                <div className='flex justify-center'>
                    <Image
                        alt='OS Img'
                        width={70}
                        height={70}
                        src={imgSrc}
                    />
                </div>

                <div className='font-bold text-center'>
                    {host.os?.version || 'N/A'}
                </div>
                <div className='flex flex-col justify-evenly text-sm h-full'>

                    <div className='flex items-center gap-x-2'>
                        <CpuChipIcon height={30} width={30} className='text-blue-600 dark:text-[#1D9FE4]'/>
                        {`${host.systemSpec?.cpuCores || 'N/A'} Cores`}
                         
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <LuMemoryStick className='h-[30px] w-[30px] text-blue-600 dark:text-[#1D9FE4]' height={30} width={30}/>
                        {`${host.systemSpec?.memory || 'N/A'} MB`}
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <CircleStackIcon height={30} width={30} className='text-blue-600 dark:text-[#1D9FE4]' />
                        {`${host.systemSpec?.disk || 'N/A'} GB`}
                    </div>
                </div>
            </div>
        </div>
        <div className='flex flex-col w-4/5 h-full items-center gap-y-6'>
            <div className='flex-1 w-full rounded-xl bg-white/70'>
                asdf
            </div>
            <div className='flex-1 w-full rounded-xl bg-white/70'>
                asdfas
            </div>
        </div>
    </div>
  )
}
