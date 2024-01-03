'use client'
import React from 'react'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Input } from '@nextui-org/react'
import { useHostsStore } from '@/store/HostsStore';


export default function FirewallRuleUpdator() {
    const [selectedRule] = useHostsStore((state) => [
        state.selectedRule,
    ]);

    const [actionKeys, setActionKeys] = React.useState(new Set([selectedRule["action"] as string]));

    const newDescription = selectedRule["description"] || '';
    const [description, setDescription] = React.useState(newDescription);


    const selectedAction = React.useMemo(
      () => Array.from(actionKeys).join(", ").replaceAll("_", " "),
      [actionKeys]
    );
  
    return (
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
                            {selectedAction}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                        aria-label="Single selection mode"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={actionKeys}
                        onSelectionChange={(keys) => setActionKeys(keys as Set<string>)}
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
  )
}


