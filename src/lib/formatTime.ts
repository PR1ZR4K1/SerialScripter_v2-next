import { create } from "domain";

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

export function formatCreatedAt(createdAt: Date) {
  const date = new Date(createdAt);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false  // Use this to get 24-hour format; remove it for 12-hour format
  };
  return date.toLocaleString('en-US', options);
}
