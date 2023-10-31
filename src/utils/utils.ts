"use client"
import React from "react";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertPOSIXTimestampToLocalTime(posixTimestamp: number): string {
  // Create a new Date object from the POSIX timestamp, in milliseconds.
  const date = new Date(posixTimestamp * 1000);

  // Get the offset between the user's local time and UTC in milliseconds.
  const offset = date.getTimezoneOffset() * 60 * 1000;

  // Add the offset to the POSIX timestamp to get the local time.
  const localtime = new Date(date.getTime() + offset);
  

  const hours = localtime.getHours();
  const minutes = localtime.getMinutes();
  const seconds = localtime.getSeconds();

  // Format the date and time as a string.
  return `${localtime} ${hours}:${minutes}:${seconds}`;
}

export function truncateDescription(description: string, maxLength: number): string {
  if (description.length <= maxLength) {
      return description;
  }
  // Split the description into words
  const words = description.split(" ");
  let truncatedDescription = words.slice(0, maxLength).join(" ");
  // Add trailing periods
  truncatedDescription += "...";
  return truncatedDescription;
}