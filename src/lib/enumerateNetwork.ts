
// function used to make call to /scan endpoint
export const fetchScanResults = async (range: string) => {
    try {

        const result = await fetch('/api/v1/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ range: range })
        });

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        // If you still want to do something with the response, you can
        const data = await result.json();
        // For example, console.log it:
        // console.log(data);

        return data

    } catch (error) {

        if (error instanceof Error) {
            console.error(`Broke at fetchScanResult: ${error.message}`);
        } else {
            console.error('Broke at fetchScanResult: An unknown error occurred');
        }

    }
};


