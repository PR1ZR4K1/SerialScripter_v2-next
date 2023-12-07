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