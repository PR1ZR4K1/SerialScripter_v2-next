import React, { useState } from "react";
import { Input, Textarea, Select, Chip, SelectItem, Dropdown, DropdownTrigger, Button, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { FaRegFileAlt } from "react-icons/fa";
import { IncidentTag } from '@prisma/client';
import { toast } from "react-hot-toast";

type CronFormProps = {
  setRefreshKeyList: (refresh: boolean) => void;
}

export default function ApiKeyForm({setRefreshKeyList}: CronFormProps) {

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget);
     // Create FormData from the form
    toast.loading('Adding api key job...', {duration: 1250});

    // console.log(formData);
    const reqBody = JSON.stringify({ keytype: formData.get('keytype'), action: 'create' });
    // console.log(reqBody);
    
    const req = await fetch('/api/v1/add/apiKey', {
      method: 'POST',
      body: reqBody, // Pass formData as body
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (req.ok) {
      toast.success('API key added successfully!');
      setRefreshKeyList(true);
    } else {
      const response = await req.json();
      console.log("Fecth brokey!")
      toast.error(`Failed to add API key!\n${response.error}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-7xl w-7xl"> {/* Centering the form on the screen */}
      <div className="flex flex-col gap-4 w-4xl"> {/* Adding vertical stacking and gap */}
        <div className="flex gap-4"> {/* First row for inputs */}
          <Input
            isRequired
            placeholder="Type of key"
            name="keytype"
            type="text"
            label="Keytype"
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