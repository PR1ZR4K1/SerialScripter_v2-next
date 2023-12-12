export function formatTimestampToPST(timestamp: number) {

//set options
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'America/Los_Angeles'
  };

//format the shiz
  return new Date(timestamp).toLocaleTimeString('en-US', options);
}

export function convertToPST(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles'
    }).format(date);
}
