import { Host } from '@prisma/client';
import { create } from 'zustand'


interface HostsStoreTypes {
    refetchCounter: number;
    setRefetchCounter: () => void;

    hosts: Host[];
    setHosts: (hosts: Host[]) => void;
    fetchHosts: () => Promise<void>;
}

export const useHostsStore = create<HostsStoreTypes>((set) => ({
    refetchCounter: 0,
    setRefetchCounter: () => {
        set((state) => ({ refetchCounter: state.refetchCounter++ }));
    },

    hosts: [],
    setHosts: (hosts: Host[]) => set({ hosts }),

    fetchHosts: async () => {
        try {
            const response = await fetch("/api/v1/get/hosts"); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            set({ hosts: data }); // Update the hosts in the store
        } catch (error) {
            console.error("Error fetching host data:", error);
        }
    }
}))