'use client'

import React from 'react'
import { useHostsStore } from '@/store/HostsStore';
import { ChipProps } from '@nextui-org/react';
import HostTable from './HostTable';
import { ExtendedContainer } from '@/store/HostsStore';
import { ContainerNetwork, ContainerVolume } from '@prisma/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"


export default function Containers() {

  const [host] = useHostsStore((state) => [
    state.host,
  ]);

  const containers = host.containers || [];


  // this is for the containers table
  // created a new type that would allow containerNetworks and volumes to be added to the container type as numbers
  // that way I can store the total num of networks and volumes in the container type
  type ExtendedContainerWithNetworksVolumesType = Omit<ExtendedContainer, 'containerNetworks' | 'containerVolumes' | 'portBindings'> & {
    portBindings: string;
    containerNetworks: number;
    containerVolumes: number;
  }

  const containersWithEverything: ExtendedContainerWithNetworksVolumesType[] = containers.map(container => {
      const totalNetworks = container.containerNetworks?.length ?? 0;
      const totalVolumes = container.containerVolumes?.length ?? 0;
    // Use the spread operator to copy other properties of the user
    let newContainer: ExtendedContainerWithNetworksVolumesType = { ...container, portBindings: container.portBindings.join(', '), containerNetworks: totalNetworks, containerVolumes: totalVolumes };
    return newContainer;
  });

  type ExtendedContainerNetworksType = ContainerNetwork & {
    name: string;
    parentContainerId: string;
  }

  type ExtendedContainerVolumesType = Omit<ContainerVolume, 'rw'> & {
    rw: string;
    name: string;
    parentContainerId: string;
  }

const containerNetworks: ExtendedContainerNetworksType[] = [];
const containerVolumes: ExtendedContainerVolumesType[] = [];

// iterate through my containers and construct new arrays of containerNetworks and containerVolumes
containers.forEach(container => {
  const containerId = container.containerId;
  const containerName = container.name;

  const networks: ExtendedContainerNetworksType[] = container.containerNetworks?.map(network => ({
    ...network,
    parentContainerId: containerId,
    name: containerName
  })) || [];

  const volumes: ExtendedContainerVolumesType[] = container.containerVolumes?.map(volume => ({
    ...volume,
    rw: volume.rw ? 'True' : 'False',
    parentContainerId: containerId,
    name: containerName
  })) || [];

  containerNetworks.push(...networks);
  containerVolumes.push(...volumes);
});

// containerNetworks and containerVolumes are now separate arrays


  const containersColumns = [
    {
      key: 'name',
      label: "Name",
      sortable: true,
    }, 
    {
      key: 'containerId', 
      label: "Container Id",
      sortable: true,
    },
    {
      key: 'containerNetworks', 
      label: "Networks"
    },
    {
      key: 'portBindings', 
      label: "Port Bindings",
      sortable: true,
    },
    {
      key: 'containerVolumes', 
      label: "Volumes"
    },
    {
      key: 'status', 
      label: "Status",
      sortable: true,
    },
    {
      key: 'cmd', 
      label: "Command"
    },
  ];

    // id: number;
    // networkName: string;
    // ip: string;
    // gateway: string;
    // macAddress: string;
    // containerId: number;
// } & {
    // name: string;
    // containerId: string;

  const containerNetworksColumns = [
    {
      key: 'name',
      label: "Container Name",
      sortable: true,
    }, 
    {
      key: 'parentContainerId', 
      label: "Container Id"
    },
    {
      key: 'networkName', 
      label: "Name",
      sortable: true,
    },
    {
      key: 'ip', 
      label: "IP",
      sortable: true,
    },
    {
      key: 'gateway', 
      label: "Gateway",
    },
    {
      key: 'macAddress', 
      label: "MAC Address",
    },
  ];

  const containerVolumesColumns = [    {
      key: 'name',
      label: "Container Name",
      sortable: true,
    }, 
    {
      key: 'parentContainerId', 
      label: "Container Id"
    },
    {
      key: 'volumeName', 
      label: "Name",
      sortable: true,
    },
    {
      key: 'hostPath', 
      label: "Host Path",
    },
    {
      key: 'containerPath', 
      label: "Container Path",
    },
    {
      key: 'mode', 
      label: "Mode",
    },
    {
      key: 'rw', 
      label: "Read/Write",
    },
    {
      key: 'vType', 
      label: "Volume Type",
    },
  ];

    const containerTypeColorMap: Record<string, ChipProps["color"]> = {
      True: "success",
      False: "danger",
  };

  const views = ['Containers', 'Container Networks', 'Container Volumes'];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }
  
    api.on("select", () => {
      setCurrentIndex((api.selectedScrollSnap() + 1) - 1)
    })

  }, [api, currentIndex])
  return (
    <div className='h-full w-full flex flex-col items-center'>
        <div className='flex flex-col gap-y-20 items-center w-3/4 h-3/4'>
          <p className='text-2xl font-bold'>
            {host.hostname}&apos;s {views[currentIndex]}
          </p>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
                <CarouselItem >
                  <HostTable rows={containersWithEverything} columns={containersColumns} />
                </CarouselItem>
                <CarouselItem >
                  <HostTable rows={containerNetworks} columns={containerNetworksColumns} />
                </CarouselItem>
                <CarouselItem >
                  <HostTable rows={containerVolumes} columns={containerVolumesColumns} colorMap={containerTypeColorMap} colorField='rw'/>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className='dark:bg-gray-600 hover:dark:bg-purple-900 hover:bg-blue-400'/>
            <CarouselNext className='dark:bg-gray-600 hover:dark:bg-purple-900 hover:bg-blue-400'/>
          </Carousel>
        </div>
    </div>
  )
}
