'use client'

import React, { useState, useRef, useEffect } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";
import { useScriptingHubStore } from '@/store/ScriptingHubStore';
import { Pagination } from '@nextui-org/react';
import { useTheme } from "next-themes";
import { Typography, Tooltip } from "@material-tailwind/react";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';


export default function AnsibleOutputModal() {

  const [isAnsibleModalOpen, closeAnsibleModal, ansibleOutput] = useScriptingHubStore((state) => [
    state.isAnsibleModalOpen,
    state.closeAnsibleModal,
    state.ansibleOutput,
  ]);

  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [value, copy] = useCopyToClipboard();
  const [copied, setCopied] = React.useState(false);
  // console.log(ansibleOutput)
  // length of list for pagination
  const pages = ansibleOutput.length;


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

  const handleAnsibleOutputModalClose = () => {
    window.location.reload();
    closeAnsibleModal();
  }


  useEffect(() => {
    if (typeof window !== "undefined" && jsonContainerRef.current && ansibleOutput[page - 1]) {

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
      };
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
  }, [ansibleOutput, page, theme]);


  return (
        <Modal 
          size={'5xl'} 
          isOpen={isAnsibleModalOpen} 
          onClose={handleAnsibleOutputModalClose} 
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
                <ModalBody className='flex flex-col items-center justify-center mt-4 gap-y-4'>
                  <div className='flex w-full justify-end pr-6 h-5'>
                    <div 
                      className=''
                      onMouseLeave={() => setCopied(false)}
                      onClick={() => {
                        copy(`${ansibleOutput[page-1].output}`);
                        setCopied(true);
                      }}
                      >
                      <Tooltip content={copied ? "Copied" : "Copy"}>
                        {copied ? (
                          <CheckIcon className="h-4 w-4 text-white" />
                        ) : (
                          <DocumentDuplicateIcon className="h-4 w-4 text-white" />
                        )}
                      </Tooltip>
                    </div>
                  </div>
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