'use client'

import React, { useEffect, useState } from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { getHostInfo } from '@/lib/getHostInfo';
import { Host as PrismaHost, OS, NetworkService, User } from "@prisma/client";

type Host = PrismaHost & {
  os?: OS;
  networkServices?: NetworkService[];
  users?: User[];
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

    // conditionally render content in my page
    if (view === 'home'){
        content = <div>My Host: {host.hostname}</div>;
    } else if (view === 'services'){
        content = <div>My Services: {host.ip}</div>;
    } else if (view === 'users'){
        content = <div>My Users: {hostname}</div>;
    } else if (view === 'xterm') {
        content = <div>My Dashboard: {hostname}</div>;
    }

    console.log(lastUpdated)

    return (
        <>
            <div className='absolute bottom-4 right-0 font-extralight'>
                Last Updated - {lastUpdated}
            </div>
            <div className='mt-4'>
                {content}
            </div> 
        </>
    );
}
