import React from 'react'
import Topbar from './Topbar'
import HostViews from './HostViews'

function Page({ params }: { params: { host: string } }) {
  return (


    <section className='flex flex-col w-full h-screen items-center'>
      <Topbar hostname={params.host} />
      <div className='w-[90%] flex h-full mt-5 relative'>
        <HostViews hostname={params.host}/>
      </div>
    </section>
  )
};

export default Page