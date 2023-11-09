'use client'
import { useState, useEffect } from 'react';
// import BarGraph from '@/components/BarCharts';
// import PieGraph from '@/components/PieCharts';
import { ComplexNavbar } from '@/components/Navbar';
import { HostsTable } from '@/components/Datagrid';
import { CarouselDefault } from '@/app/(authenticated)/Carousel';
import { DialogCustomAnimation } from '@/components/Dialoge';
import toast from 'react-hot-toast';
import { getServerSession } from "next-auth";

export default function Home() {
   // const session = await getServerSession(authOptions);


    const [open, setDialogOpen] = useState(false);

    const handleDialogOpen = () => setDialogOpen(!open);

    const addHostsToDB = async () => {
        const res = await fetch('http://localhost:3000/api/hosts');
        const data = await res.json();
        console.log(data);
    }

    return (
        <main className='flex flex-col items-center min-h-screen w-full'>
            <div className='w-3/5 h-3/5 my-10'>
                <CarouselDefault />
            </div>

            <div className='w-3/4 h-3/4 mb-unit-x'>
                {/* <HostsTable handleDialogOpen={handleDialogOpen} /> */}
                {/* <DialogCustomAnimation open={open} handleOpen={handleDialogOpen} /> */}
            </div>
        </main>
    );
}

