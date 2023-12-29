import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { useHostsStore } from "@/store/HostsStore";
import toast from "react-hot-toast";

export default function FirewallModal() {
    const [ isFirewallModalOpen, closeFirewallModal, host ] = useHostsStore((state) =>
        [
        state.isFirewallModalOpen,
        state.closeFirewallModal,
        state.host
        ]
    );
    const [selectedKeys, setSelectedKeys] = React.useState('test');

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );
  
    const updateFirewallRules = async (e: FormData) => {
        try {
            const result = await fetch('/api/v1/update/host/firewallRules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                })
            });

            const data = await result.json();
            console.log(data);
            if (!data.success) {
                throw new Error(data.message);
            }
            toast.success('Firewall rules updated successfully');
        } catch (error) {
            toast.error(`Error updating firewall rules: ${error}`);
        }
    }

  return (
    <form action={updateFirewallRules}>
      <Modal 
        backdrop="opaque" 
        isOpen={isFirewallModalOpen} 
        onClose={closeFirewallModal}
        size="2xl"
        isDismissable={false}
        classNames={{
          backdrop: "bg-gradient-to-t from-gray-900 to-gray-900/10 backdrop-opacity-20 dark:from-purple-900 to-purple-900/10 overflow-y-scroll"
        }}
        className="dark:bg-[#141B29] max-h-unit-9xl overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1">Update Firewall Configuration </ModalHeader>
              <ModalBody className="flex justify-center gap-x-4 w-full px-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="bordered" 
                    className="capitalize"
                  >
                    {selectedValue}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                >
                  <DropdownItem key="text">Text</DropdownItem>
                  <DropdownItem key="number">Number</DropdownItem>
                  <DropdownItem key="date">Date</DropdownItem>
                  <DropdownItem key="single_date">Single Date</DropdownItem>
                  <DropdownItem key="iteration">Iteration</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </form>
  );
}
