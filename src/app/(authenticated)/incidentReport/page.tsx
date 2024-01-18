"use client"
import React from 'react'
import IncidentForm from './incidentForm';

export default function Cron() {
  return ( 
      <section className='flex flex-col w-full h-screen items-center gap-y-20 '>
          <h1 className='text-2xl font-bold mt-20'>Report an Incident</h1>
          <div className='w-[90%] justify-center h-full relative'>
              <IncidentForm/>
          </div>
      </section>
  );  
}
