import React, { useEffect } from 'react'
import HostTable from '@/components/DynamicTable'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { getHostInfo } from '@/lib/getHostInfo';
import { Host } from '@prisma/client';
import FirewallModal from './FirewallModal';
import { ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export type openFirewallModalTypes = {
  action?: string;
  dport?: number;
  description?: string | null
}

interface CompareRulesProps {
  originalRules: openFirewallModalTypes[];
  rulesToUpdate: openFirewallModalTypes[];
}

function CompareRules({ originalRules, rulesToUpdate }: CompareRulesProps) {
  
  // ensure there are rules to compare
  if (rulesToUpdate.length === 0) {
    return (
      <div className='flex flex-col gap-y-20 items-center justify-center w-3/4 h-3/4'>
        <p className='text-2xl font-bold'>
          No firewall rules to update
        </p>
      </div>
    );
  } else {
    return (
      <div className='flex flex-col items-center gap-y-12 overflow-y-auto h-full w-full'>
        <div className='flex justify-center items-start w-full'>
          <div className='flex justify-center w-1/2'>
            <p>
              <span className='font-bold text-2xl text-center'>Current Rules</span>
            </p>
          </div>
          <div className='flex justify-center w-1/2'>
            <p>
              <span className='font-bold text-2xl text-center'>Incoming Rules</span>
            </p>
          </div>
        </div>
          {rulesToUpdate.map((ruleToUpdate, index) => {
            const originalRule = originalRules.find(rule => rule.dport === ruleToUpdate.dport) || ruleToUpdate;
            
            const changedAction = originalRule.action !== ruleToUpdate.action;
            const changedDescription = originalRule.description !== ruleToUpdate.description;
            return (

              <div key={index} className='flex justify-start w-full relative'>
                {/* Current Rule Side */}
                <div className='flex justify-center items-center gap-x-8 w-1/2 h-8 '>

                  <Button
                    className='h-8'
                    variant='flat'
                    color={changedAction ? 'danger' : 'primary'}
                    isDisabled
                  >
                    {originalRule.action}
                  </Button>
                  <Button
                    className='h-8'
                    variant='solid'
                    isDisabled
                  >
                    {originalRule.dport}
                  </Button>
                  <p
                    className={`flex h-8 w-[205.33px] text-ellipsis ${changedDescription ? 'text-red-500' : ''} items-center justify-center text-center font-light text-xs`}
                  >
                    {originalRule.description || ''}
                  </p>
                </div>

                <div className='mr-8 h-8 border-l-1 dark:border-l-gray-500 border-l-black/70' />

                {/* Incoming Rule Side */}
                <div className='flex justify-center items-center gap-x-8 w-1/2 '>

                  <Button
                    className='h-8'
                    variant='flat'
                    color={changedAction ? 'success' : 'primary'}
                    isDisabled
                  >
                    {ruleToUpdate.action}
                  </Button>
                  <Button
                    className='h-8'
                    variant='solid'
                    isDisabled
                  >
                    {ruleToUpdate.dport}
                  </Button>
                  <p
                    className={`flex items-center justify-center h-8 w-[205.33px] text-ellipsis ${changedDescription ? 'text-green-500' : ''} text-center font-light text-xs`}
                  >
                    {ruleToUpdate.description || ''}
                  </p>
                </div>
              </div>
            )
          })}
      </div>
    )
  }
}

function Firewall({hostname}: {hostname: string}) {

  const [host, setHost, openFirewallModal, setSelectedRule, setActionKeys, setDescription, setIsNewRule, setFirewallPort] = useHostsStore((state) => [
    state.host,
    state.setHost,
    state.openFirewallModal,
    state.setSelectedRule,
    state.setActionKeys,
    state.setFirewallRuleDescription,
    state.setIsNewRule,
    state.setFirewallPort,
  ]);

  const [grabbingRules, setGrabbingRules] = React.useState(false);
  const [tableView, setTableView] = React.useState(true);
  const [originalRules, setOriginalRules] = React.useState<openFirewallModalTypes[]>([]);
  const [rulesToUpdate, setRulesToUpdate] = React.useState<openFirewallModalTypes[]>([]);

  const firewallRules = host.firewallRules || [];

  const firewallRulesWithDescription = firewallRules.map((rule) => {
    return {
      ...rule,
      description: rule.description || 'Add description...',
    }
  });
  
  const firewallColumns = [
    {
      key: 'protocol', 
      label: "Protocol",
      sortable: true,
    },
    {
      key: 'dport', 
      label: "Destination Port",
      sortable: true,
    },
    {
      key: 'description', 
      label: "Description of Purpose",
    },
    {
      key: 'action',
      label: "Action",
      sortable: true,
    }, 
    {
      key: 'editField',
      label: "Edit Rule",
    }, 
  ];

  const firewallTypeColorMap: Record<string, ChipProps["color"]> = {
    accept: "success",
    drop: "danger",
  };

  useEffect(() => {
  
    const firewallRulesLocalStorage = `rulesToUpdate-${hostname}`;
    let localRules: openFirewallModalTypes[] = JSON.parse(localStorage.getItem(firewallRulesLocalStorage) || '[]');

    if (tableView !== true) {
      let computedOriginalRules: openFirewallModalTypes[] = localRules.map(ruleToUpdate => {
        const correspondingRule = host.firewallRules!.find(firewallRule => firewallRule.dport === ruleToUpdate.dport);
        return correspondingRule ? {
          ...ruleToUpdate,
          action: correspondingRule.action,
          description: correspondingRule.description || 'Add description...',
        } : null;
      }).filter(rule => rule !== null) as openFirewallModalTypes[];

      setOriginalRules(computedOriginalRules);
    }
    setRulesToUpdate(localRules);
  }, [host.firewallRules, hostname, tableView]);

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
      try {
        const {now, host}: {now: string, host: Host} = await getHostInfo(hostname);
        setHost(host);
        // Use hostInfo here
      } catch (error) {
          // Handle error
          console.log(error);
      }
      return {success: true, message: response.msg};
    }
  }

  const updateRules = async () => {
    const result = await fetch('/api/v1/update/firewallRules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hostId: host.id,
        hostIp: host.ip,
        rules: rulesToUpdate,
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
    
    toast.loading('Grabbing firewall rules...', { duration: 1500 });
    const result = await grabRules();

    setGrabbingRules(false);

    if (result.success) {
      toast.success(result.message);
    } else {      
      toast.error(result.message);
    }
  }

  // handler for updating rules
  const handleUpdateRules = async () => {
    
    toast.loading(`Updating ${hostname}'s firewall rules...` , { duration: 1500 });
    const result = await updateRules();

    if (result.success) {
      setOriginalRules([]);
      setRulesToUpdate([]); 
      window.localStorage.setItem(firewallRulesLocalStorage, JSON.stringify([]));
      setTableView(true);
      toast.success(result.message);
    } else {      
      toast.error(result.message);
    }
  }

  const handleClearRemoteRules = async () => {
    const result = await fetch('/api/v1/clear/firewallRules', {
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
      toast.error(response.error);
    } else {
      try {
        const {now, host}: {now: string, host: Host} = await getHostInfo(hostname);
        setHost(host);
        // Use hostInfo here
      } catch (error) {
          // Handle error
          console.log(error);
      }
      toast.success(response.msg);
    }
  }


  const firewallRulesLocalStorage = `rulesToUpdate-${hostname}`

  return (
    <div className='h-3/4 w-full flex flex-col items-center'>
      {
        tableView ? (
          <>
            <div className='flex flex-col gap-y-8 items-center w-3/4 max-h-[900px]'>
              <p className='text-2xl font-bold'>
                {host.hostname}&apos;s Firewall Configuration
              </p>
              <HostTable
                rows={firewallRulesWithDescription}
                columns={firewallColumns}
                colorMap={firewallTypeColorMap}
                colorField='action'
                editField={({ action, dport, description }: openFirewallModalTypes) =>
                {
                  setSelectedRule({ action, dport, description: description || 'Add description...' });
                  setActionKeys(new Set([action as string]));
                  setDescription(description || 'Add description...');
                  openFirewallModal();
                }}

              />
              <div className='flex justify-between items-center w-full'>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='ghost'
                  endContent={<ArrowPathIcon width={15} height={15} />}
                  isDisabled={grabbingRules}
                  onClick={handleGrabRules}
                >
                  Refresh Rules
                </Button>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='solid'
                  endContent={<PlusCircleIcon width={15} height={15} />}
                  isDisabled={grabbingRules}
                  onClick={() => {
                    setSelectedRule({ action: 'accept', dport: 0, description: 'Add description...' });
                    setActionKeys(new Set(['accept' as string]));
                    setDescription('Add description...');
                    setFirewallPort('0');
                    setIsNewRule(true);
                    openFirewallModal();
                  }}
                >
                  Add New Rule
                </Button>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='flat'
                  endContent={<TrashIcon width={15} height={15} />}
                  isDisabled={grabbingRules}
                  onClick={handleClearRemoteRules}
                >
                  Clear Remote Rules
                </Button>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='shadow'
                  isDisabled={grabbingRules}
                  onClick={() => setTableView(false)}
                >
                  Update Rules
                </Button>
              </div>
            </div>
            <FirewallModal hostname={hostname} />
          </>
        )
        :
        (
          <div className='flex flex-col gap-y-14 items-center w-3/4 h-[85%]'>
            
            <CompareRules originalRules={originalRules} rulesToUpdate={rulesToUpdate} />
            <div className='flex justify-between items-center w-full'>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='ghost'
                  startContent={<ArrowLeftIcon width={15} height={15} />}
                  onClick={() => {
                    setTableView(true)
                  }}
                >
                  Return
                </Button>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='flat'
                  isDisabled={rulesToUpdate.length === 0}
                  onClick={() => {
                    window.localStorage.setItem(firewallRulesLocalStorage, JSON.stringify([]));
                    setOriginalRules([]);
                    setTableView(true);
                    toast.success('Changes cleared!');
                  }}
                >
                  Clear Changes
                </Button>
                <Button
                  className='w-1/6'
                  color='secondary'
                  variant='shadow'
                  isDisabled={rulesToUpdate.length === 0}
                  endContent={<CheckCircleIcon width={20} height={20} />}
                  onClick={handleUpdateRules}
                >
                  Confirm
                </Button>
            </div>  
          </div>
        )
      }
    </div>
  )
}

export default Firewall