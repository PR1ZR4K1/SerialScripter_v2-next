'use client'
// import BarGraph from '@/components/BarCharts';
// import PieGraph from '@/components/PieCharts';
import { CarouselDefault } from '@/app/(authenticated)/Carousel';
import { HostsTable } from '@/app/(authenticated)/HostsTable';
import { DialogCustomAnimation } from '@/app/(authenticated)/Dialoge';
import { useState } from 'react';
// import { enumerateNetwork } from '@/lib/enumerateNetwork'
import { Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';


export default function App() {
   // const session = await getServerSession(authOptions);
  const [open, setDialogOpen] = useState(false);   

//   const handleDialogOpen = () => setDialogOpen(!open);     
//   const addHostsToDB = async () => {
//       const res = await fetch('http://localhost:3000/api/hosts');
//       const data = await res.json();
//       console.log(data);
//   }




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

