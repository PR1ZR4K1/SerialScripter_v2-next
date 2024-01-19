// React componnet to generate a link using exec from gotty the binary and embeded in a iframe
// to be used in the browser

import React, { useEffect, useState } from "react";
import { useHostsStore } from "@/store/HostsStore";
import { toast } from "react-hot-toast";

export default function Xterm() {
    const [host] = useHostsStore((state) => [state.host]);
    const [xtermUrl, setXtermUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchUrl = async () => {
            setIsLoading(true);
            setIsError(false);
            
            try {
                const response = await fetch(`/api/v1/get/xterm/${host.ip}?os=${host.os}`);
                
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                
                const data = await response.json();
                console.log(data);
                setXtermUrl(data.url);
            } catch (error) {
                toast.error("Error getting xterm URL: " + error);
                setIsError(true);
            }
            setIsLoading(false);
        };
        
        fetchUrl();
    }, [host.ip, host.os]); // Re-run the effect if host.ip changes

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading xterm.</div>;
    }
    console.log(xtermUrl);

    return (
        <iframe
            src={xtermUrl}
            title="xterm"
            width="90%"
            height="90%"
            className="overflow-hidden ring-1 ring-black rounded-lg p-0 m-0"

        />
    );
};
