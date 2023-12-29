'use client'
import React from 'react'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from '@nextui-org/react'


export default function FirewallRuleUpdator() {
    const [protocolKeys, setprotocolKeys] = React.useState(new Set(["tcp"]));

    const selectedProtocol = React.useMemo(
      () => Array.from(protocolKeys).join(", ").replaceAll("_", " "),
      [protocolKeys]
    );
  
    return (
        <div className='flex justify-center gap-x-4 w-full px-4'>
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                        variant="bordered" 
                        className="capitalize"
                        >
                        {selectedProtocol}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={protocolKeys}
                    onSelectionChange={(keys) => setprotocolKeys(keys as Set<string>)}
                >
                    <DropdownItem key="tcp" textValue='tcp'><Chip className="capitalize" color='primary' size="sm" variant="flat">TCP</Chip></DropdownItem>
                    <DropdownItem key="udp" textValue='udp'><Chip className="capitalize" color='secondary' size="sm" variant="flat">UDP</Chip></DropdownItem>
                    {/* <DropdownItem key="any" textValue='any'><Chip className="capitalize" color='warning' size="sm" variant="flat">ANY</Chip></DropdownItem> */}
                </DropdownMenu>
            </Dropdown>
        </div>
  )
}


