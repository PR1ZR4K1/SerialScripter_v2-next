'use client'
import React, { useEffect, useState, } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Textarea} from "@nextui-org/react";
import { getAnsibleParameter } from '@/lib/ansibleParameter'
import { PlaybookParametersType, useScriptingHubStore } from '@/store/ScriptingHubStore';
import { Pagination } from '@nextui-org/react';

type FieldDefinition = {
  label: string;
  name: string;
  placeholder: string;
};

type PlaybookInputs = {
  id: number;
  playbookId: number;
  playbook: string;
  hostname: string;
  hostIp: string;
  extra_vars: string;
}


// Function to generate initial states
const generateInitialStates = (playbooks: PlaybookParametersType[]) => {
  const fieldDefs: FieldDefinition[] = [];
  const playbookInputs: PlaybookInputs[] = [];

  playbooks.forEach((playbook, index) => {
    fieldDefs.push({
      label: `${playbook.hostname ? `Hostname: ${playbook.hostname}` : `IP: ${playbook.hostIp}`}  |  Playbook: ${playbook.playbook}.yml`,
      name: `${playbook.id}`,
      placeholder: `Full string with spaces...`
    });

    playbookInputs.push({
      id: index,
      playbook: playbook.playbook,
      playbookId: playbook.id,
      hostname: playbook.hostname,
      hostIp: playbook.hostIp,
      extra_vars: '',
    });
  });

  return { fieldDefs, playbookInputs };
};

export default function AnsibleFormModal() {

  const [isParameterModalOpen, closeParameterModal, setParameterizedPlaybooks, parameterizedPlaybooks] = useScriptingHubStore((state) => [
    state.isParameterModalOpen,
    state.closeParameterModal,
    state.setParameterizedPlaybooks,
    state.parameterizedPlaybooks,
  ]);

  const [isFirstMount, setIsFirstMount] = useState(true);
  const { fieldDefs, playbookInputs } = generateInitialStates(parameterizedPlaybooks);

  const [playbookInputsState, setPlaybookInputsState] = React.useState<PlaybookInputs[]>([]);

  useEffect(() => {
    if (isParameterModalOpen && isFirstMount) {
      setPlaybookInputsState(playbookInputs);
      setIsFirstMount(false);
    }
  }, [isParameterModalOpen, playbookInputs, isFirstMount])

  // Initialize states with generated values
  const [page, setPage] = useState(1);
  const pages = parameterizedPlaybooks.length;

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // Get the value from the text area
    const value = e.target.value;

    console.log('inputs', playbookInputsState)

    // Update the state based on checking the page number against the id of the playbook
    setPlaybookInputsState((prevPlaybookInputs) => {
      return prevPlaybookInputs.map((playbookInput) => {
        if (playbookInput.id === page - 1) {
          return { ...playbookInput, extra_vars: value };
        } else {
          return playbookInput;
        }
      });
    });
  }
  
  // Conditional rendering of the modal
  if (!isParameterModalOpen) {
    return null;
  }
  return (
    <form action={getAnsibleParameter}>
        <Modal 
            isOpen={isParameterModalOpen} 
            onClose={closeParameterModal}
            placement="top-center"
            className='max-h-[75%] overflow-y-auto'
        >
            <ModalContent>
            {(onClose) => (
                <form className='flex flex-col gap-y-6'>
                  <ModalHeader className="flex flex-col gap-y-4 font-bold items-center text-center">
                    Enter Ansible Params
                    <div className='border w-11/12 dark:border-gray-400 border-gray-700' />
                  </ModalHeader>
                  <ModalBody className='flex justify-center items-center h-32'>
                      <Textarea
                          autoFocus
                          label={fieldDefs[page - 1].label}
                          labelPlacement='outside'
                          name={fieldDefs[page - 1].name}
                          description="Ex: 'ansible_user=root ansible_password=test'"
                          placeholder={fieldDefs[page - 1].placeholder}
                          variant="bordered"
                          size='lg'
                          className='flex flex-col gap-y-4'
                          value={playbookInputsState[page - 1]?.extra_vars || ''}
                          onChange={handleTextAreaChange}
                      />
                  </ModalBody>
                  <ModalFooter className='flex flex-col gap-y-8'>
                      <div className='flex items-center justify-center'>
                        <Pagination
                          showControls={pages > 3}
                          color="primary"
                          variant='light'
                          page={page}
                          total={pages}
                          onChange={setPage}
                        />
                      </div>
                      <Button onClick={() => 
                        {
                          setParameterizedPlaybooks(playbookInputsState);
                          onClose();
                        }
                      } 
                        color="danger" 
                        variant="flat"
                        >
                          Submit
                      </Button>
                  </ModalFooter>
                </form>
            )}
            </ModalContent>
        </Modal>
    </form>
  );
}
