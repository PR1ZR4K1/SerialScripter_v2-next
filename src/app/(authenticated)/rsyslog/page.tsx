'use client'
import { useState, useEffect } from 'react';
import { LogGrid } from './LogGrid'
import { CarouselDefault } from '@/components/Carousel';
import { DialogCustomAnimation } from '@/components/Dialoge';

export default function Rsyslog() {
  const [open, setDialogOpen] = useState(false);

  const handleDialogOpen = () => setDialogOpen(!open);

  return (
    <main className='flex flex-col items-center h-3/4'>
        <div>
            <p>My filler description</p>
        </div>
        
        <div className='w-3/4 h-3/4'>
          <LogGrid handleDialogOpen={handleDialogOpen}/>
          <DialogCustomAnimation open={open} handleOpen={handleDialogOpen} />
        </div>
    </main>
  );  
}
 