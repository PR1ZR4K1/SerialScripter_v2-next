import React, { useState } from "react";
import { Input, Textarea, Select, Chip, SelectItem, Dropdown, DropdownTrigger, Button, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { FaRegFileAlt } from "react-icons/fa";
import { IncidentTag } from '@prisma/client';
import { toast } from "react-hot-toast";

type CronFormProps = {
  setRefreshCronList: (refresh: boolean) => void;
}

export default function CronForm({setRefreshCronList}: CronFormProps) {

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget);
     // Create FormData from the form
    toast.loading('Adding cron job...', {duration: 1250});

    console.log(formData);
    const reqBody = JSON.stringify({ name: formData.get('name'), command: formData.get('command'), schedule: formData.get('schedule'), action: 'create' });
    console.log(reqBody);
    
    const req = await fetch('/api/v1/cronJob', {
      method: 'POST',
      body: reqBody, // Pass formData as body
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (req.ok) {
      toast.success('Cronjob added successfully!');
      setRefreshCronList(true);
    } else {
      const response = await req.json();
      console.log("Fecth brokey!")
      toast.error(`Failed to add cron job!\n${response.error}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-7xl w-7xl"> {/* Centering the form on the screen */}
      <div className="flex flex-col gap-4 w-4xl"> {/* Adding vertical stacking and gap */}
        <div className="flex gap-4"> {/* First row for inputs */}
          <Input
            isRequired
            placeholder="Name of the task"
            name="name"
            type="text"
            label="Name"
            className="max-w-xs w-full" // Adjust width to full
          />
        </div>

        <div className="flex gap-4"> {/* Second row for new inputs */}
          <Input
              isRequired
              name="command"
              type="text"
              label="Command"
              placeholder="Enter your command"
              className="max-w-xs w-full" // Adjust width to full
            />
        </div>

        <div className="flex flex-col gap-x-4 justify-center w-full">
        <Input
              isRequired
              name="schedule"
              type="text"
              label="Schedule"
              placeholder="Enter your schedule"
              className="max-w-xs w-full" // Adjust width to full
            />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </form>
  );
}