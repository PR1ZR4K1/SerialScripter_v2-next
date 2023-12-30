import React, {useEffect} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Input} from "@nextui-org/react";
import { useHostsStore } from "@/store/HostsStore";
import toast from "react-hot-toast";

export default function FirewallModal({hostname}: {hostname: string}) {
  const [ isFirewallModalOpen, closeFirewallModal, selectedRule, isFirstOpen, setFirstOpen ] = useHostsStore((state) =>
      [
        state.isFirewallModalOpen,
        state.closeFirewallModal,
        state.selectedRule,
        state.isFirstOpen,
        state.setFirstOpen,
      ]
  );


  const [actionKeys, setActionKeys] = React.useState(new Set([selectedRule["action"] as string]));
  const [description, setDescription] = React.useState(selectedRule["description"] || '');

  const selectedAction = React.useMemo(
    () => Array.from(actionKeys).join(", ").replaceAll("_", " "),
    [actionKeys]
  );

  const firewallRulesLocalStorage = `rulesToUpdate-${hostname}`

  // console.log(actionKeys)
  
  return (
      <Modal 
        backdrop="opaque" 
        isOpen={isFirewallModalOpen} 
        onClose={closeFirewallModal}
        size="2xl"
        isDismissable={false}
        classNames={{
          backdrop: "bg-gradient-to-t from-gray-600 to-gray-900/10 backdrop-opacity-20 dark:from-purple-900 to-purple-900/10 overflow-y-scroll"
        }}
        className="dark:bg-[#141B29] bg-gray-200 max-h-unit-9xl overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-y-4">
                <p>
                  Update Firewall Configuration
                </p>
                <div className="w-11/12 h-[1px] dark:bg-white bg-black"/>
              </ModalHeader>
              <ModalBody className="flex flex-col mt-10 items-center justify-center gap-y-8">
              <div className='flex justify-evenly gap-x-4 w-full px-4'>
                <div className='flex flex-col gap-y-2 w-28'>
                    <p>
                        <span className='font-semibold'>Action:</span>
                    </p>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="ghost" 
                                className="capitalize h-14"
                                >
                                {isFirstOpen ?  selectedRule['action'] : selectedAction}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Single selection mode"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={actionKeys}
                            onSelectionChange={(keys) => { setActionKeys(keys as Set<string>); setFirstOpen()}}
                        >
                            <DropdownItem key="accept" textValue='accept'><Chip className="capitalize" color='success' size="sm" variant="flat">ACCEPT</Chip></DropdownItem>
                            <DropdownItem key="drop" textValue='drop'><Chip className="capitalize" color='danger' size="sm" variant="flat">DROP</Chip></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className='flex flex-col gap-y-2 w-28'>

                    <p>
                        <span className='font-semibold'>Port:</span>
                    </p>
                    <Button isDisabled className='h-14 font-semibold' variant='solid'>{selectedRule['dport']}</Button>
                </div>
                <div className='flex flex-col gap-y-2 w-28'>

                    <p>
                        <span className='font-semibold'>Description:</span>
                    </p>
                    <Input
                        onChange={e => setDescription(e.target.value)}
                        name='description'
                        value={description}
                        variant='underlined'
                        placeholder="purpose..." />
                </div>
            </div>
                <div className="w-5/6 h-[1px] dark:bg-white/80 bg-black/80"/>
              </ModalBody>
              <ModalFooter className="mt-10">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              <Button
                color="primary"
                onClick={() => { 

                      if (selectedAction === '' && description === selectedRule["description"] || selectedAction === selectedRule["action"] && description === selectedRule["description"]) {
                        toast.error("No changes made to firewall rule.");
                      } else if (selectedAction !== selectedRule["action"] || description !== selectedRule["description"]) {
                        
                        const rulesToUpdate = window.localStorage.getItem(firewallRulesLocalStorage);
                        console.log(rulesToUpdate)
                        toast.success("Firewall rule updated.");
                      }
                      console.log('bruh')
                      onClose();
                    }}>
                  Add Change
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}
