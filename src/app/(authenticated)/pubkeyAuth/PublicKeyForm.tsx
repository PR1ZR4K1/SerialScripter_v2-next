import React from 'react'
import { Input } from '@nextui-org/react'

type PublicKeyFormProps = {
    name: string;
    setName: (name: string) => void;
    publicKey: string;
    setPublicKey: (key: string) => void;
}

export default function PublicKeyForm({name, setName, publicKey, setPublicKey}: PublicKeyFormProps) {

  return (
    
      <div className='flex flex-col w-3/4 gap-y-20 items-center justify-center'>
          <Input
            className='w-1/2'
            isRequired
            label="Name"
            defaultValue="jaylon"
            description="Name or hostname of person's public key"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className='w-full'
            size='lg'
            isRequired
            label="Key"
            defaultValue="ssh-rsa"
            description="Public key..."
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
      </div>
  )
};
