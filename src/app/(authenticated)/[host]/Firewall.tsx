import React from 'react'
import HostTable from './HostTable'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';

type FirewallResponseTypes = {
  success: boolean;
  message: string;
}

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

  // React.useEffect(() => {
  //   if (host.firewallRules && host.firewallRules.length > 0) {
  //     setHasRules(true);
  //   }
  // }, [host.firewallRules])    

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

    const response = await result.json();
    // console.log(response)

    if (response.error) {
      return {success: false, message: response.error};
    } else {
      return {success: true, message: response.msg};
    }
  }

  const handleGrabRules = async () => {
    setGrabbingRules(true);
    
    toast.loading('Grabbing firewall rules...', { duration: 1000 });
    const result = await grabRules();

    setGrabbingRules(false);

    if (!result.success) {
      toast.error(result.message);
    } else {      
      toast.success(result.message);
    }
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