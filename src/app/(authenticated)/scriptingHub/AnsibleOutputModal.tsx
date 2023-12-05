'use client'

import React, { useState, useRef, useEffect } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";
import { useScriptingHubStore } from '@/store/ScriptingHubStore';
import { Pagination } from '@nextui-org/react';
import { useTheme } from "next-themes";


export default function AnsibleOutputModal() {

  const [isAnsibleModalOpen, closeAnsibleModal, ansibleOutput] = useScriptingHubStore((state) => [
    state.isAnsibleModalOpen,
    state.closeAnsibleModal,
    state.ansibleOutput,
  ]);

  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  // console.log(ansibleOutput)
  // length of list for pagination
  const pages = ansibleOutput.length;
  const formattedJsonConfig = {
      hoverPreviewEnabled: true,
      hoverPreviewArrayCount: 100,
      hoverPreviewFieldCount: 5,
      theme: theme,
      animateOpen: true,
      animateClose: true,
      useToJSON: true,
      maxArrayItems: 100,
      exposePath: false
}

  // const formatJSON = (jsonString: string) => {

  //   if (typeof window === "undefined") return document.createElement('div'); // Ensure this runs client-side


  //   try {
  //     // Parse the JSON string into an object
  //     const json = JSON.parse(jsonString);
  //     const formatter = new JSONFormatter(json, Infinity, formattedJsonConfig);
  //     return formatter.render();
  //   } catch (error) {
  //     console.error('Error parsing or formatting JSON', error);
  //     return document.createElement('div'); // Return an empty div or some error message
  //   }
  // }


  const jsonContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (typeof window !== "undefined" && jsonContainerRef.current && ansibleOutput[page - 1]) {
      import('json-formatter-js').then(JSONFormatter => {
        const json = JSON.parse(ansibleOutput[page - 1].output);
        const formatter = new JSONFormatter.default(json, Infinity, formattedJsonConfig);
        const formattedJSON = formatter.render();
        if (jsonContainerRef.current) { // Additional check here
          jsonContainerRef.current.innerHTML = '';
          jsonContainerRef.current.appendChild(formattedJSON);
        }
      }).catch(error => console.error('Error loading JSONFormatter:', error));
    }
  }, [ansibleOutput, page]);


  return (
        <Modal 
          size={'5xl'} 
          isOpen={isAnsibleModalOpen} 
          onClose={closeAnsibleModal} 
          scrollBehavior='inside'
          isDismissable={false}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col justify-center items-center font-bold gap-y-5">
                  <div className='text-2xl'>
                    Deployment Results
                  </div>  

                  { ansibleOutput.length > 0 ? (
                    <div className='flex text-center font-light gap-x-10'>
                      <div>
                        {`Host: ${ansibleOutput[page-1].ip}`}
                      </div>
                      <div>
                        {`Playbook: ${ansibleOutput[page-1].playbookName}`}
                      </div>
                    </div>
                    )
                    
                    :
                    (
                      <div className='flex text-center font-light gap-x-10'>
                        <div>
                          {`Host: No Host`}
                        </div>
                        <div>
                          {`Playbook: No Playbook`}
                        </div>
                      </div>
                    )
                  }

                  <div className='border w-11/12 dark:border-gray-200 border-gray-700' />
                    
                </ModalHeader>
                <ModalBody className='flex flex-col items-center justify-center mt-4'>
                  <div ref={jsonContainerRef} className='json-output max-h-96 max-w-4xl'></div>
                  {/* <p>
                    {ansibleOutput[page].output}
                  </p> */}

                </ModalBody>
                <ModalFooter className='flex flex-col'>
                  <>
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

                    <div className='flex items-end justify-end mt-4'>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                    </div>
                  </>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    );
}