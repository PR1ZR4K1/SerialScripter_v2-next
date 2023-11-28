import { Host } from '@prisma/client'

// function to add a single host to db
export const addHostToDB = async (newHost: Host) => {
    try {

        const result = await fetch(`/api/v1/add/host`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({newHost: newHost})
        });

        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        // If you still want to do something with the response, you can
        // const data = await result.json();
        // For example, console.log it:
        // console.log(data);

    } catch (error) {

        if (error instanceof Error) {
            console.error(`Broke at addHostToDB:\n Host Object: ${newHost}`);
        } else {
            console.error('Broke at addHostToDB: An unknown error occurred');
        }

    }
}

// function to add multiple hosts to db, I want it like this so that
// I can update my ui based on the completion of this function.
