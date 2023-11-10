import { create } from 'zustand'
import { Host } from "@prisma/client";


interface Row {
    key: string;
    hostname: string;
    ip: string;
    os: string;
}

interface HubState {
    linuxHosts: Row[];
    getLinuxHosts: () => void;

    windowsHosts: Row[];
    getWindowsHosts: () => void;

    // linuxPlaybooks: Playbooks[];
    // getLinuxPlaybooks: () => void;

    // windowsPlaybooks: Playbooks[];
    // getWindowsPlaybooks: () => void;

    selectedKeysLinuxPlaybooks: Set<string | number>;
    setSelectedKeysLinuxPlaybooks: (keys: Set<string | number>) => void;

    selectedKeysLinuxHosts: Set<string | number>;
    setSelectedKeysLinuxHosts: (keys: Set<string | number>) => void;

    selectedKeysWindowsPlaybooks: Set<string | number>;
    setSelectedKeysWindowsPlaybooks: (keys: Set<string | number>) => void;

    selectedKeysWindowsHosts: Set<string | number>;
    setSelectedKeysWindowsHosts: (keys: Set<string | number>) => void;
}

export const useScriptingHubStore = create<HubState>((set) => ({
    linuxHosts: [],
    getLinuxHosts: () => {
        fetch('/api/get/linuxHosts')
            .then(res => res.json())
            .then(data => {
                set({ linuxHosts: data })
            })
    },

    windowsHosts: [],
    getWindowsHosts: () => {
        fetch('/api/get/windowsHosts')
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
    setSelectedKeysLinuxPlaybooks: (keys: Set<string | number>) => set({ selectedKeysLinuxPlaybooks: keys }),

    selectedKeysLinuxHosts: new Set([]),
    setSelectedKeysLinuxHosts: (keys: Set<string | number>) => set({ selectedKeysLinuxHosts: keys }),

    selectedKeysWindowsPlaybooks: new Set([]),
    setSelectedKeysWindowsPlaybooks: (keys: Set<string | number>) => set({ selectedKeysWindowsPlaybooks: keys }),

    selectedKeysWindowsHosts: new Set([]),
    setSelectedKeysWindowsHosts: (keys: Set<string | number>) => set({ selectedKeysWindowsHosts: keys }),
}))