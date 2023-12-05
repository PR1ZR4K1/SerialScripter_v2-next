import { Host } from '@prisma/client';
import { create } from 'zustand'


interface HostsStoreTypes {
    refetchCounter: number;
    setRefetchCounter: () => void;

    hosts: Host[];
    fetchHosts: () => Promise<void>;
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
            set({ hosts: data.data }); // Update the hosts in the store
        } catch (error) {
            console.error("Error fetching host data:", error);
        }
    }
}))