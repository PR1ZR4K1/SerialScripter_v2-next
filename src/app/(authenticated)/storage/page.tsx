'use client'
import React from 'react'
import {Button} from "@nextui-org/react";


function Page() {

  return (
    <div className='h-screen flex justify-center items-center'>
      {/* <Button onClick={downloadStorage} variant='shadow' color='secondary'> */}
      <Button variant='shadow' color='secondary'>
        <a href='/storage/blobStorage.zip' download='blobStorage'>
          Download Blob Storage
        </a>
      </Button>
    </div>
  )
}

export default Page