'use client';

import { useEffect, useState } from 'react'
import ScriptingHubTable from '@/components/AnsiblePlaybooksTable';
import { columns, rows } from './scriptDataWindows';
import { Button } from '@nextui-org/react';
import { ArrowLeftIcon, ArrowRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import AnsibleHostsTable from '@/components/AnsibleHostsTable';
import { deployAnsiblePlaybooks } from '@/lib/AnsibleHelper';
import { PlaybookParametersType, useScriptingHubStore } from '@/store/ScriptingHubStore';


export default function WindowsActions() {
  const [view, setView] = useState('scripts');
  const [playbooksToDeploy, setPlaybooksToDeploy] = useState<PlaybookParametersType[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const [selectedKeysWindowsHosts, selectedKeysWindowsPlaybooks, setAnsibleOutput, isParameterModalOpen, openAnsibleModal, openParameterModal, parameterizedPlaybooks, setParameterizedPlaybooks, windowsHosts, getWindowsHosts] = useScriptingHubStore((state) => [
    state.selectedKeysWindowsHosts,
    state.selectedKeysWindowsPlaybooks,
    state.setAnsibleOutput,
    state.isParameterModalOpen,
    state.openAnsibleModal,
    state.openParameterModal,
    state.parameterizedPlaybooks,
    state.setParameterizedPlaybooks,
    state.windowsHosts,
    state.getWindowsHosts,
  ]);

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

    if (!isParameterModalOpen && parameterizedPlaybooks.length > 0) {
      proceedWithDeployment();
    }

    if (isFirstRender) {
      getWindowsHosts();
      setIsFirstRender(false);
    }
  }, [getWindowsHosts, isFirstRender, isParameterModalOpen, windowsHosts, openAnsibleModal, parameterizedPlaybooks.length, selectedKeysWindowsHosts, selectedKeysWindowsPlaybooks, setAnsibleOutput, parameterizedPlaybooks, playbooksToDeploy])


  // get list of playbooks that need to take user input for parameters
  const getParameterizedPlaybooks = () => {
    const playbooksWithParameters: PlaybookParametersType[] = []; 
    const playbooksWithNoParameters: PlaybookParametersType[] = []; 

    selectedKeysWindowsPlaybooks.forEach(playbookId => {
      const hasParameter: boolean = rows[playbookId].parameter;

      if (hasParameter) {
        
        selectedKeysWindowsHosts.forEach((hostId, index) => {
          playbooksWithParameters.push(
            { 
              id: index,
              playbookId: playbookId,
              playbook: rows[playbookId].scriptName,
              hostIp: windowsHosts[hostId].ip,
              hostname: windowsHosts[hostId].hostname,
              extra_vars: '', 
            }
          )
        });
      } else {
        // no parameters, so just add to list of playbooks to deploy
        selectedKeysWindowsHosts.forEach((hostId, index) => {
          playbooksWithNoParameters.push(
            { 
              id: index,
              playbookId: playbookId,
              playbook: rows[playbookId].scriptName,
              hostIp: windowsHosts[hostId].ip,
              hostname: windowsHosts[hostId].hostname,
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

        const {playbooksWithParameters, playbooksWithNoParameters} = getParameterizedPlaybooks();

        // playbooks need parameters
        if (playbooksWithParameters.length > 0) {
          // open modal to get parameter
          setParameterizedPlaybooks(playbooksWithParameters);
          setPlaybooksToDeploy(playbooksWithNoParameters);
          openParameterModal();
          return;
        } else {
          const output = await deployAnsiblePlaybooks({ 
              playbooksToDeploy: playbooksWithNoParameters,
              os: 'windows' 
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
            <h1 className='text-5xl'>Windows Playbooks</h1>
            <div className=''>
                <ScriptingHubTable os='windows' columns={columns} rows={rows} />
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
            <h1 className='text-5xl'>Windows Hosts</h1>
            <AnsibleHostsTable os='windows' />
          </div>

          <div className='flex justify-between items-end pt-5'>
            <Button onClick={() => setView('scripts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowLeftIcon width={15} height={15} />}>
              Select Playbooks
            </Button>
            <Button onClick={handleDeployment} className='hover:shadow-black hover:shadow-lg' color='danger' endContent={<RocketLaunchIcon width={15} height={15} />}>
              Deploy Baby!
            </Button>
          </div>
        </div>
        )
    
  )
}
