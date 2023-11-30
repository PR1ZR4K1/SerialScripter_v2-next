'use client'
import React, { useState, } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { getAnsibleParameter } from '@/lib/ansibleParameter'
import { useScriptingHubStore } from '@/store/ScriptingHubStore';
import { Pagination } from '@nextui-org/react';
 

export default function AnsibleFormModal() {

  const [isParameterModalOpen, closeParameterModal, parameterizedPlaybooks] = useScriptingHubStore((state) => [
    state.isParameterModalOpen,
    state.closeParameterModal,
    state.parameterizedPlaybooks,
  ]);

  const fieldDefinitions = parameterizedPlaybooks.map((playbook, index) => ({
    label: `Parameter ${playbook.id}`, // Or use `index + 1` if id is not appropriate
    name: `parameter${playbook.id}`,
    placeholder: `Enter Parameter ${playbook.id}`
  }));

  type FormData = {
    [key: string]: string;
  };


  const [formData, setFormData] = useState<FormData>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const [page, setPage] = useState(1);
  const pages = parameterizedPlaybooks.length;

//   const readAnsiblePlaybook = () => {

//   }
  

  return (
    <form action={getAnsibleParameter}>
        <Modal 
            isOpen={isParameterModalOpen} 
            onClose={closeParameterModal}
            placement="top-center"
        >
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Enter the parameter</ModalHeader>
                <ModalBody>
                    <Input
                        autoFocus
                        label={fieldDefinitions[page - 1].label}
                        placeholder={fieldDefinitions[page - 1].placeholder}
                        variant="bordered"
                        value={formData[fieldDefinitions[page - 1].name] || ''}
                        onChange={(e) => handleInputChange(fieldDefinitions[page - 1].name, e.target.value)}
                    />
                </ModalBody>
                <ModalFooter className='flex flex-col gap-y-8'>
                    <div className='flex items-center justify-center mt-12'>
                      <Pagination
                        showControls={pages > 3}
                        color="primary"
                        variant='light'
                        page={page}
                        total={pages}
                        onChange={setPage}
                      />
                    </div>
                    <Button type='submit' color="danger" variant="flat" onClick={(e) => {
                        e.preventDefault();
                        closeParameterModal();
                        console.log(formData); // Here, you can process the formData
                    }}>
                        Submit
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    </form>
  );
}
