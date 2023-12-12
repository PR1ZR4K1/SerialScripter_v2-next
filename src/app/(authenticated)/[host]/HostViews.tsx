'use client'

import React, { useEffect, useState } from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { getHostInfo } from '@/lib/getHostInfo';
import { Host as PrismaHost, OS, NetworkService, UserAccount } from "@prisma/client";
import Home from './Home';
import Services from './Services';
import Users from './Users';

type Host = PrismaHost & {
  os?: OS;
  networkServices?: NetworkService[];
  users?: UserAccount[];
};


export default function HostViews({hostname}: {hostname: string}) {
    const [view, host, setHost] = useHostsStore((state) => [
        state.view,
        state.host,
        state.setHost,
    ]);

    const [lastUpdated, setLastUpdated] = useState('');

    useEffect( () => {
        async function fetchHostInfo() {
            try {
                const {now, host}: {now: string, host: Host} = await getHostInfo(hostname);
                setHost(host);
                setLastUpdated(now)
                // Use hostInfo here
            } catch (error) {
                // Handle error
                console.log(error);
            }
        };

        fetchHostInfo();
    }, [hostname, setHost]);

    let content;

    console.log(host)

    // conditionally render content in my page
    if (view === 'home'){
        content = <Home />
    } else if (view === 'services'){
        content = <Services />;
    } else if (view === 'users'){
        content = <Users />
    } else if (view === 'xterm') {
        content = <div>My Dashboard: {hostname}</div>;
    }


    return (
        <>
            <div className='absolute bottom-2 right-0 font-extralight'>
                Last Updated - {lastUpdated}
            </div>
            <div className='flex w-full mt-4 justify-center '>
                {content}
            </div> 
        </>
    );
}
