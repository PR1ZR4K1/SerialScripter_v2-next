import { Host } from '@prisma/client';
import { create } from 'zustand'


interface HostsStoreTypes {
    refetchCounter: number;
    incrementRefetchCounter: () => void;

    hosts: Host[];
    fetchHosts: () => Promise<void>;
}

export const useHostsStore = create<HostsStoreTypes>((set) => ({
    refetchCounter: 0,
    incrementRefetchCounter: () => {
        set((state) => ({ refetchCounter: state.refetchCounter++ }));
    },

    hosts: [],

    fetchHosts: async () => {
        try {
            const response = await fetch("/api/v1/get/hosts", { cache: 'no-store' }); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('i am gay')
            const data = await response.json();
            set({ hosts: data.get(data) }); // Update the hosts in the store
        } catch (error) {
            console.error("Error fetching host data:", error);
        }
    }
}))