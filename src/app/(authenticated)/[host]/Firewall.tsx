import React from 'react'
import HostTable from './HostTable'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';

function Firewall() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const [hasRules, setHasRules] = React.useState(false);
  const [grabbingRules, setGrabbingRules] = React.useState(false);

  const firewallRules = host.firewallRules || [];
  
    const firewallColumns = [
    {
      key: 'action',
      label: "Action",
      sortable: true,
    }, 
    {
      key: 'dport', 
      label: "Destination Port",
      sortable: true,
    },
    {
      key: 'protocol', 
      label: "Protocol",
      sortable: true,
    },
  ];

  const firewallTypeColorMap: Record<string, ChipProps["color"]> = {
    accept: "success",
    drop: "danger",
  };

  React.useEffect(() => {
    if (host.firewallRules && host.firewallRules.length > 0) {
      setHasRules(true);
    }
  }, [host.firewallRules])    

  const grabRules = async () => {
    const result = await fetch('/api/v1/get/host/firewallRules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hostId: host.id,
        hostIp: host.ip,
      })
    });

    const json = await result.json();

    if (json.success) {
      toast.success('Successfully grabbed firewall rules! Refresh to see them.')
    }
  }

  const handleGrabRules = async () => {
    setGrabbingRules(true);
    
    const result = await toast.promise(fetch('/api/v1/get/host/firewallRules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hostId: host.id,
        hostIp: host.ip,
      })
    }),
      {
        loading: 'Grabbing firewall rules...',
        success: 'Successfully grabbed firewall rules! Refresh to see them.',
        error: (err) => 'Failed to grab firewall rules! ' + err.message || 'Unknown error',
      }
    );

    setGrabbingRules(false);
  }

  return (
    <div className='h-full w-full flex flex-col items-center'>
      {
        hasRules ?
          (
          <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4'>
            <p className='text-2xl font-bold'>
              {host.hostname}&apos;s Firewall Configuration
            </p>
            <HostTable rows={firewallRules} columns={firewallColumns} colorMap={firewallTypeColorMap} colorField='action'/>
          </div>
          )
          :
          (
            <div className='flex flex-col gap-y-20 items-center justify-center w-3/4 h-3/4'>
            <p className='text-2xl font-bold'>
              {!grabbingRules ? `${host.hostname} has no firewall rules` : 'Grabbing firewall rules...'}
            </p>
              <Button
                className='w-1/2'
                color='secondary'
                variant='ghost'
                isDisabled={grabbingRules}
                onClick={handleGrabRules}
              >
                Grab Firewall Rules
              </Button>
          </div>
          )
      }
    </div>
  )
}

export default Firewall