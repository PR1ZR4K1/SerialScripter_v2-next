import { create } from 'zustand'

import { Host as PrismaHost, NetworkService, UserAccount, Incident, Software, SystemService, Disk, Connection, Share, Container, ContainerNetwork, ContainerVolume, FirewallRule } from "@prisma/client";

export type ExtendedContainer = Container & {
    containerNetworks?: ContainerNetwork[];
    containerVolumes?: ContainerVolume[];
}
type openFirewallModalTypes = {
    action?: string;
    dport?: number;
    description?: string | null
}
  
type Host = PrismaHost & {
    systemServices?: SystemService[];
    networkServices?: NetworkService[];
    userAccounts?: UserAccount[];
    incidents?: Incident[];
    software?: Software[];
    disks?: Disk[];
    connections?: Connection[];
    shares?: Share[];
    containers?: ExtendedContainer[];
    firewallRules?: FirewallRule[];
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

    isFirewallModalOpen: boolean;
    openFirewallModal: () => void;
    closeFirewallModal: () => void;
    isFirstOpen: boolean;
    setFirstOpen: () => void;

    selectedRule: openFirewallModalTypes;
    setSelectedRule: (rule: openFirewallModalTypes) => void;

    actionKeys: Set<string>;
    setActionKeys: (keys: Set<string>) => void;

    firewallRuleDescription: string;
    setFirewallRuleDescription: (description: string) => void;

    firewallPort: string;
    setFirewallPort: (description: string) => void;

    isNewRule: boolean;
    setIsNewRule: (isNewRule: boolean) => void;
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
            // console.log(data.data)
            set({ hosts: data.data }); // Update the hosts in the store
        } catch (error) {
            console.error("Error fetching host data:", error);
        }
    },

    view: 'home',
    setView: (view: string) => set({ view: view }),

    host: {
        id: 0, // Default ID, assuming 0 is an invalid or placeholder ID
        hostname: 'N/A', // Placeholder value
        os: 'N/A', // Placeholder value
        version: 'N/A', // Placeholder value
        memory: 0, // Placeholder value
        cores: 0, // Placeholder value
        cpu: 'N/A', // Placeholder value
        ip: '0.0.0.0', // Default IP, indicating an invalid or non-existent IP
        status: 'UP', // Default status
        gateway: null,
        dhcp: null,
        macAddress: null, // Assuming macAddress can be null or you might use a placeholder
        createdAt: new Date(0), // Represents the Unix Epoch (January 1, 1970)
        networkServices: [],
        // Include any other missing fields with their default or placeholder values
    },
    setHost: (host: Host) => set({ host: host }),

    isFirewallModalOpen: false,
    openFirewallModal: () => set({ isFirewallModalOpen: true, isFirstOpen: true }),
    closeFirewallModal: () => set({ isFirewallModalOpen: false, isNewRule: false }),
    isFirstOpen: true,
    setFirstOpen: () => set({ isFirstOpen: false }),

    selectedRule:
    {
        action: '',
        dport: 0,
        description: 'Add description...',
    },
    setSelectedRule: (rule: openFirewallModalTypes) => set({ selectedRule: rule }),

    actionKeys: new Set(),
    setActionKeys: (keys: Set<string>) => set({ actionKeys: keys }),

    firewallRuleDescription: '',
    setFirewallRuleDescription: (description: string) => set({ firewallRuleDescription: description }),

    firewallPort: '',
    setFirewallPort: (port: string) => set({ firewallPort: port }),

    isNewRule: false,
    setIsNewRule: (isNewRule: boolean) => set({ isNewRule: isNewRule }),
}));