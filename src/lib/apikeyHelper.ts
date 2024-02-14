export function addHoursToCurrentTime(hours: number) {
  const secondsPerHour = 3600;
  return Math.floor((Date.now() / 1000) + (hours * secondsPerHour));
}