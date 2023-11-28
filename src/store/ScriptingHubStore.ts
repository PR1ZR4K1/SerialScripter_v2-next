import { create } from 'zustand'
import { Host } from "@prisma/client";


interface Row {
    key: number;
    hostname: string;
    ip: string;
    os: string;
}

interface HubState {
    linuxHosts: Host [];
    getLinuxHosts: () => void;

    windowsHosts: Host [];
    getWindowsHosts: () => void;

    // linuxPlaybooks: Playbooks[];
    // getLinuxPlaybooks: () => void;

    // windowsPlaybooks: Playbooks[];
    // getWindowsPlaybooks: () => void;

    selectedKeysLinuxPlaybooks: Set<number>;
    setSelectedKeysLinuxPlaybooks: (keys: Set<number>) => void;

    selectedKeysLinuxHosts: Set<number>;
    setSelectedKeysLinuxHosts: (keys: Set<number>) => void;

    selectedKeysWindowsPlaybooks: Set<number>;
    setSelectedKeysWindowsPlaybooks: (keys: Set<number>) => void;

    selectedKeysWindowsHosts: Set<number>;
    setSelectedKeysWindowsHosts: (keys: Set<number>) => void;
}

export const useScriptingHubStore = create<HubState>((set) => ({
    linuxHosts: [],
    getLinuxHosts: () => {
        fetch('/api/v1/get/linuxHosts')
            .then(res => res.json())
            .then(data => {
                set({ linuxHosts: data })
            })
    },

    windowsHosts: [],
    getWindowsHosts: () => {
        fetch('/api/v1/get/windowsHosts')
            .then(res => res.json())
            .then(data => {
                set({ windowsHosts: data })
            })
    },  

    // linuxPlaybooks: [],
    // getLinuxPlaybooks: () => {
    //     fetch('/api/playbooks?os=linux')
    //         .then(res => res.json())
    //         .then(data => {
    //             set({ linuxPlaybooks: data })
    //         })
    // },

    // windowsPlaybooks: [],
    // getWindowsPlaybooks: () => {
    //     fetch('/api/playbooks?os=windows')
    //         .then(res => res.json())
    //         .then(data => {
    //             set({ windowsPlaybooks: data })
    //         })
    // },

    selectedKeysLinuxPlaybooks: new Set([]),
    setSelectedKeysLinuxPlaybooks: (keys: Set<number>) => set({ selectedKeysLinuxPlaybooks: keys }),

    selectedKeysLinuxHosts: new Set([]),
    setSelectedKeysLinuxHosts: (keys: Set<number>) => set({ selectedKeysLinuxHosts: keys }),

    selectedKeysWindowsPlaybooks: new Set([]),
    setSelectedKeysWindowsPlaybooks: (keys: Set<number>) => set({ selectedKeysWindowsPlaybooks: keys }),

    selectedKeysWindowsHosts: new Set([]),
    setSelectedKeysWindowsHosts: (keys: Set<number>) => set({ selectedKeysWindowsHosts: keys }),
}))