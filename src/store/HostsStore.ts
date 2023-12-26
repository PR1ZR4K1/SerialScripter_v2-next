import { create } from 'zustand'

import { Host as PrismaHost, OS, NetworkService, UserAccount, SystemInfo, Incident, Software, SystemService, Disk } from "@prisma/client";

type Host = PrismaHost & {
  os?: OS;
  systemInfo?: SystemInfo;
  systemServices?: SystemService[];
  networkServices?: NetworkService[];
  userAccounts?: UserAccount[];
  incidents?: Incident[];
  software?: Software[];
  disks?: Disk[];
};

interface HostsStoreTypes {
    refetchCounter: number;
    setRefetchCounter: () => void;

    hosts: Host[];
    fetchHosts: () => Promise<void>;

    view: string;
    setView: (view: string) => void;

    host: Host;
    setHost: (host: Host) => void;
}

const { signal } = new AbortController()

export const useHostsStore = create<HostsStoreTypes>((set) => ({
    refetchCounter: 0,
    setRefetchCounter: () => {
    set((state) => ({ refetchCounter: state.refetchCounter + 1 }));
    },


    hosts: [],

    fetchHosts: async () => {
        try {
            const response = await fetch("/api/v1/get/hosts", { next: { revalidate: 10 }, cache: 'no-store', signal }); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.data)
            set({ hosts: data.data }); // Update the hosts in the store
        } catch (error) {
            console.error("Error fetching host data:", error);
        }
    },

    view: 'home',
    setView: (view: string) => set({view: view}),

    host: {
        id: 0, // Default ID, assuming 0 is an invalid or placeholder ID
        hostname: 'N/A', // Placeholder value
        ip: '0.0.0.0', // Default IP, indicating an invalid or non-existent IP
        osId: 0, // Default OS ID, assuming 0 is a placeholder value
        status: 'UP', // Default status
        gateway: null,
        dhcp: null,
        systemInfoId: null, // Assuming systemSpecId can be null
        macAddress: null, // Assuming macAddress can be null or you might use a placeholder
        createdAt: new Date(0), // Represents the Unix Epoch (January 1, 1970)
        networkServices: [],
        // Include any other missing fields with their default or placeholder values
    },
    setHost: (host: Host) => set({ host: host}),

}));