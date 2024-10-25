'use client'

import React, { useEffect, useState } from 'react'
import Xterm from './Xterm';
import { useHostsStore } from '@/store/HostsStore';
import { getHostInfo } from '@/lib/getHostInfo';
import { Host as PrismaHost, NetworkService, UserAccount } from "@prisma/client";
import Home from './Home';
import Services from './Services';
import Users from './Users';
import { convertToPST } from '@/lib/formatTime';
import Disks from './Disks';
import Connections from './Connections';
import Shares from './Shares';
import Containers from './Containers';
import Firewall from './Firewall';
import { notFound } from 'next/navigation'

type Host = PrismaHost & {
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

    useEffect(() => {
        async function fetchHostInfo() {
            try {
                const { now, host }: { now: string, host: Host } = await getHostInfo(hostname);
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
        content = <Home />
    } else if (view === 'services'){
        content = <Services />;
    } else if (view === 'users'){
        content = <Users />
    } else if (view === 'xterm') {
        content = <Xterm />
    } else if (view === 'disks') {
        content = <Disks />
    } else if (view === 'connections') {
        content = <Connections />
    } else if (view === 'shares') {
        content = <Shares />
    } else if (view === 'containers') {
        content = <Containers />
    } else if (view === 'firewall') {
        content = <Firewall hostname={hostname} />
    }

    
    let lastCreated = 'N/A';

    if (host.createdAt) {
        lastCreated = convertToPST(host.createdAt.toString());
    }

    return (
        <>
            <div className='absolute top-0 left-10 font-extralight'>
                First Scanned: {lastCreated} 
            </div>
            <div className='absolute bottom-4 right-0 font-extralight'>
                Last Updated - {lastUpdated}
            </div>
            <div className='flex w-full mt-12 justify-center '>
                {content}
            </div> 
        </>
    );
};
