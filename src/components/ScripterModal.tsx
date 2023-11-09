import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip} from "@nextui-org/react";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

type ModalProps = {
    scriptName: string;
    description: string;
}
export default function ScripterModal({scriptName, description}: ModalProps) {

  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleOpen = () => {
    onOpen();
  }

    return (    
    <>
        <button className="flex flex-wrap gap-3 text-yellow-400">
            <Tooltip content="Description">
                <InformationCircleIcon onClick={handleOpen} width={25} height={25} />
            </Tooltip>
        </button>
        <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">{scriptName}</ModalHeader>
                <ModalBody>
                    <p> 
                        {description}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
        </>
    );
}