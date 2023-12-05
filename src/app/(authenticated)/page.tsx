// import BarGraph from '@/components/BarCharts';
// import PieGraph from '@/components/PieCharts';
import { CarouselDefault } from '@/app/(authenticated)/Carousel';
import { HostsTable } from '@/app/(authenticated)/HostsTable';
import { use } from 'react';
import { Host } from "@prisma/client";

// import { enumerateNetwork } from '@/lib/enumerateNetwork'
// import { fetchHosts } from '@/lib/actions';


export default function Home() {
//     async function fetchHosts() {
//    try {
//        const response = await fetch("http://localhost:3000/api/v1/get/hosts", { next: { tags: ['fetchHosts'] } }); // Replace with your actual API endpoint
//        if (!response.ok) {
//            throw new Error(`HTTP error! Status: ${response.status}`);
//        }

//        const data = await response.json();
//        return data.data;
//    } catch (error) {
//        console.error("Error fetching host data:", error);
//        return [];
//    }
// }

//     const hosts: Host[] = use(fetchHosts());


    return (
        <main className='flex flex-col items-center min-h-screen w-full'>
            <div className='w-3/5 h-3/5 my-10'>
                <CarouselDefault />
            </div>

            <div className='w-3/4 h-3/4 mb-unit-xl'>
                <HostsTable />
            </div>



        </main>
    );
}

