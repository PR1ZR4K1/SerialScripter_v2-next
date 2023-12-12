import React, { useMemo, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Breadcrumbs, BreadcrumbItem, Input } from "@nextui-org/react";

// Define an enum for page names
enum Page {
  Name = "name",
  Command = "command",
  Schedule = "schedule",
  Review = "review",
}

// Define the type for ModalNav props
interface ModalNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

// Since this component doesn't receive any props, we can use an empty interface for props
interface AppProps {}

export default function CreateNewCronJobModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState<Page>(Page.Name);

  return (
    <>
      <Button onPress={onOpen} color="primary" className="ml-20">Create New Job</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create a new cron job</ModalHeader>
              <ModalNav currentPage={currentPage} setCurrentPage={setCurrentPage}/>
              <ModalBody>
                {currentPage === Page.Name && <div>
                    <div className="mb-5 mt-1">
                        Please enter the name of your job
                    </div>
                    <NameInputBox/>
                </div>}
                {currentPage === Page.Command && <div>Command Content</div>}
                {currentPage === Page.Schedule && <div>Schedule Content</div>}
                {currentPage === Page.Review && <div>Review Content</div>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Create New Task
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function ModalNav({ currentPage, setCurrentPage }: ModalNavProps) {
  return (
    <Breadcrumbs className="flex flex-col ml-6" underline="active" onAction={(key) => setCurrentPage(key as Page)}>
      <BreadcrumbItem key={Page.Name} isCurrent={currentPage === Page.Name}>
        Name
      </BreadcrumbItem>
      <BreadcrumbItem key={Page.Command} isCurrent={currentPage === Page.Command}>
        Command
      </BreadcrumbItem>
      <BreadcrumbItem key={Page.Schedule} isCurrent={currentPage === Page.Schedule}>
        Schedule
      </BreadcrumbItem>
      <BreadcrumbItem key={Page.Review} isCurrent={currentPage === Page.Review}>
        Review
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}


const NameInputBox: React.FC<AppProps> = () => {
    // Specify the type of state
    const [value, setValue] = useState<string>("");
  
    // Add type for the parameter and return type for the function
    const validateName = (value: string): boolean => 
      value.match(/\s/) == null;
  
    // useMemo should also have a return type specified
    const isInvalid: boolean = useMemo(() => {
      if (value === "") return false;
      return !validateName(value);
    }, [value]);
  
    return (
      <Input
        value={value}
        type="name"
        label="Name"
        variant="bordered"
        isInvalid={isInvalid}
        color={isInvalid ? "danger" : "success"}
        errorMessage={isInvalid ? "Please enter a valid name" : undefined}
        onValueChange={(e: string) => setValue(e)}
        className="max-w-xs"
      />
    );
  };