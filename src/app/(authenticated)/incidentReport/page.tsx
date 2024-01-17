"use client"
import React from 'react'
import IncidentForm from './incidentForm';

export default function Cron() {
  return ( 
      <section className='flex flex-col w-full h-screen items-center'>
          <h1 className='text-7xl text-blue-gray-700 dark:text-gray-400 mt-5'>Report an Incident</h1>
          <p>Report and incident by filling out the below form</p>
          <div className='w-[90%] justify-center h-full relative'>
              <IncidentForm/>
          </div>
      </section>
  );  
}
