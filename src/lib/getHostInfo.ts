export const getHostInfo = async (hostname: string) => {
    try {

        const result = await fetch('/api/v1/get/host', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hostname: hostname })
        });

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        // If you still want to do something with the response, you can
        const data = await result.json();
        // For example, console.log it:
        return data

    } catch (error) {

        if (error instanceof Error) {
            console.error(`Broke at fetchScanResult: ${error.message}`);
        } else {
            console.error('Broke at fetchScanResult: An unknown error occurred');
        }
    }
};