'use client';

import { useEffect, useState } from 'react'
import ScriptingHubTable from '@/components/AnsiblePlaybooksTable';
import { columns, rows } from './scriptDataLinux';
import { Button } from '@nextui-org/react';
import { ArrowLeftIcon, ArrowRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import AnsibleHostsTable from '@/components/AnsibleHostsTable';
import { PlaybookParametersType, useScriptingHubStore } from '@/store/ScriptingHubStore';
import { deployAnsiblePlaybooks } from '@/lib/AnsibleHelper';


export default function LinuxActions() {
  const [view, setView] = useState('scripts');

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFirstDeployment, setIsFirstDeployment] = useState(true);
  const [playbooksToDeploy, setPlaybooksToDeploy] = useState<PlaybookParametersType[]>([]);
  const [selectedKeysLinuxHosts, selectedKeysLinuxPlaybooks, setAnsibleOutput, isParameterModalOpen, openAnsibleModal, openParameterModal, parameterizedPlaybooks, setParameterizedPlaybooks, linuxHosts, getLinuxHosts] = useScriptingHubStore((state) => [
    state.selectedKeysLinuxHosts,
    state.selectedKeysLinuxPlaybooks,
    state.setAnsibleOutput,
    state.isParameterModalOpen,
    state.openAnsibleModal,
    state.openParameterModal,
    state.parameterizedPlaybooks,
    state.setParameterizedPlaybooks,
    state.linuxHosts,
    state.getLinuxHosts,
  ])

  useEffect(() => {

    const proceedWithDeployment = async () => {
      setPlaybooksToDeploy((prevPlaybooksToDeploy) => [...prevPlaybooksToDeploy, ...parameterizedPlaybooks]);
      const output = await deployAnsiblePlaybooks({ 
        playbooksToDeploy: playbooksToDeploy,
        os: 'linux' 
      });

      if (!output) {
        console.error("No output returned from deployAnsiblePlaybooks");
        return; // Exit the function if there's no output
      }

      // update ansibleOutput var for use in Modal 
      setAnsibleOutput(output);
      
      // Proceed with using the output and open the modal
      openAnsibleModal();
    }

    if (!isParameterModalOpen && parameterizedPlaybooks.length > 0 && isFirstDeployment) {
      proceedWithDeployment();
      setIsFirstDeployment(false);
    }

    if (isFirstRender) {
      getLinuxHosts();
      setIsFirstRender(false);
    }
  }, [getLinuxHosts, isFirstRender, isParameterModalOpen, linuxHosts, isFirstDeployment, openAnsibleModal, parameterizedPlaybooks.length, selectedKeysLinuxHosts, selectedKeysLinuxPlaybooks, setAnsibleOutput, parameterizedPlaybooks, playbooksToDeploy])


  // get list of playbooks that need to take user input for parameters
  const getParameterizedPlaybooks = () => {
    const playbooksWithParameters: PlaybookParametersType[] = []; 
    const playbooksWithNoParameters: PlaybookParametersType[] = [];

    selectedKeysLinuxPlaybooks.forEach(playbookId => {
      const hasParameter: boolean = rows[playbookId].parameter;

      if (hasParameter) {
        console.log('linux keys', selectedKeysLinuxHosts)
        selectedKeysLinuxHosts.forEach((hostId, index) => {
          playbooksWithParameters.push(
            { 
              id: index,
              playbookId: playbookId,
              playbook: rows[playbookId].scriptName,
              hostIp: linuxHosts[hostId].ip,
              hostname: linuxHosts[hostId].hostname,
              extra_vars: '', 
            }
          )
        });
      } else {
        // playbook does not need parameters
        selectedKeysLinuxHosts.forEach((hostId, index) => {
          playbooksWithNoParameters.push(
            { 
              id: index,
              playbookId: playbookId,
              playbook: rows[playbookId].scriptName,
              hostIp: linuxHosts[hostId].ip,
              hostname: linuxHosts[hostId].hostname,
              extra_vars: '', 
            }
          )
        });
      }

    })

    return {playbooksWithParameters, playbooksWithNoParameters};

  }

  const handleDeployment = async () => {
    try {

        const { playbooksWithParameters, playbooksWithNoParameters } = getParameterizedPlaybooks();

        // playbooks need parameters

        console.log(playbooksWithParameters)
        if (playbooksWithParameters.length > 0) {
          // open modal to get parameter
          setParameterizedPlaybooks(playbooksWithParameters);
          setPlaybooksToDeploy(playbooksWithNoParameters);
          openParameterModal();
        } else {

          const output = await deployAnsiblePlaybooks({ 
              playbooksToDeploy: playbooksWithNoParameters,
              os: 'linux' 
          });

          if (!output) {
              console.error("No output returned from deployAnsiblePlaybooks");
              return; // Exit the function if there's no output
          }

          // update ansibleOutput var for use in Modal 
          setAnsibleOutput(output);
          
          // Proceed with using the output and open the modal
          openAnsibleModal();
        }

    } catch (error) {
        console.error("Error deploying Ansible Playbooks:", error);
        // Handle any errors here
    }
};

  return (
    view === 'scripts' ? (
        <div className=''>    
          <div className='flex flex-col items-center justify-center gap-y-16'>
            <h1 className='text-5xl'>Linux Playbooks</h1>
            <div className=''>
                <ScriptingHubTable os='linux' columns={columns} rows={rows} />
            </div>
          </div>

          <div className='flex justify-end items-end pt-5'>
            <Button onClick={() => setView('hosts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowRightIcon width={15} height={15} />}>
              Select Hosts
            </Button>
          </div>
        </div>
        )
        :
        (
        <div className=' '>    
          <div className='flex flex-col items-center justify-center gap-y-16'>
            <h1 className='text-5xl'>Linux Hosts</h1>
            <AnsibleHostsTable os='linux' />
          </div>

          <div className='flex justify-between items-end pt-5'>
            <Button onClick={() => setView('scripts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowLeftIcon width={15} height={15} />}>
              Select Playbooks
            </Button>
            <Button onClick={handleDeployment} className='hover:shadow-black hover:shadow-lg' color='danger' endContent={<RocketLaunchIcon width={15} height={15} />} >
              Deploy Baby!
            </Button>
          </div>
        </div>
        )
    
  )
}
