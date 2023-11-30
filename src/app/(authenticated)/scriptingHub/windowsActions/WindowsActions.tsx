'use client';

import { useState } from 'react'
import ScriptingHubTable from '@/components/AnsiblePlaybooksTable';
import { columns, rows } from './scriptDataWindows';
import { Button } from '@nextui-org/react';
import { ArrowSmallLeftIcon, ArrowSmallRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import AnsibleHostsTable from '@/components/AnsibleHostsTable';
import { deployAnsiblePlaybooks } from '@/lib/AnsibleHelper';
import { PlaybookParametersType, useScriptingHubStore } from '@/store/ScriptingHubStore';



export default function LinuxActions() {
  const [view, setView] = useState('scripts');

  const [selectedKeysWindowsHosts, selectedKeysWindowsPlaybooks, windowsHosts, addAnsibleOutput, openAnsibleModal, openParameterModal, addParameterizedPlaybooks] = useScriptingHubStore((state) => [
    state.selectedKeysWindowsHosts,
    state.selectedKeysWindowsPlaybooks,
    state.windowsHosts,
    state.addAnsibleOutput,
    state.openAnsibleModal,
    state.openParameterModal,
    state.addParameterizedPlaybooks,
  ]);

  // get list of playbooks that need to take user input for parameters
  const getParameterizedPlaybooks = () => {
    const playbooksWithParameters: PlaybookParametersType[] = []; 

    selectedKeysWindowsPlaybooks.forEach(playbookId => {
      const hasParameter: boolean = rows[playbookId].parameter;

      if (hasParameter) {
        
        playbooksWithParameters.push({ id: playbookId, playbook: rows[playbookId].scriptName });
      
      }
    })

    return playbooksWithParameters;

  }

  const handleDeployment = async () => {
    try {

        const parameterizedPlaybooks = getParameterizedPlaybooks();

        // playbooks need parameters
        if (parameterizedPlaybooks.length > 0) {
          // open modal to get parameter
          addParameterizedPlaybooks(parameterizedPlaybooks);
          openParameterModal();
          return;
        }

        const output = await deployAnsiblePlaybooks({ 
            selectedHosts: selectedKeysWindowsHosts, 
            selectedPlaybooks: selectedKeysWindowsPlaybooks, 
            rows: rows, 
            hosts: windowsHosts, 
            os: 'windows' 
        });

        if (!output) {
            console.error("No output returned from deployAnsiblePlaybooks");
            return; // Exit the function if there's no output
        }

        console.log('yoooooo\n', output[0].ip);

//         addAnsibleOutput([
//     { ip: '192.168.0.1', playbookName: 'test.yml', output: 'Funny Output haha' },
//     { ip: '192.168.0.2', playbookName: 'deploy.yml', output: 'Deployment Complete' },
//     { ip: '192.168.0.3', playbookName: 'update.yml', output: 'Update Successful' },
//     { ip: '192.168.0.4', playbookName: 'backup.yml', output: 'Backup Done' },
//     { ip: '192.168.0.5', playbookName: 'cleanup.yml', output: 'Cleanup Finished' },
//     { ip: '192.168.0.6', playbookName: 'restore.yml', output: 'Restore Processed' }
// ]);

        // update ansibleOutput var for use in Modal 
        addAnsibleOutput(output);
        
        // Proceed with using the output and open the modal
        openAnsibleModal();

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
            <Button onClick={() => setView('hosts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowSmallRightIcon width={15} height={15} />}>
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
            <Button onClick={() => setView('scripts')} className='hover:shadow-gray-800 hover:shadow-lg' color='primary' endContent={<ArrowSmallLeftIcon width={15} height={15} />}>
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
