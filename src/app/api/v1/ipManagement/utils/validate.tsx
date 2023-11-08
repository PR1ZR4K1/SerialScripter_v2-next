export const validateIPAddress = (ipAddress: string) => {
    // Regular expression for a simple IP address format validation
    const ipPattern =
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  
    return ipPattern.test(ipAddress);
  };
  