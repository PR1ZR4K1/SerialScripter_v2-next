import React from "react";
import { Input, Textarea, Select } from "@nextui-org/react";

export default function IncidentForm() {
  return (
    <div className="flex justify-center items-center h-screen"> {/* Centering the form on the screen */}
      <div className="flex flex-col gap-4"> {/* Adding vertical stacking and gap */}
        <div className="flex gap-4"> {/* First row for inputs */}
          <Input
            isRequired
            type="name"
            label="Name"
            defaultValue="My super duper bad incident!"
            className="max-w-xs w-full" // Adjust width to full
          />
          
          <Input
            isRequired
            type="date"
            label="Date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="max-w-xs w-full" // Adjust width to full
          />

          <Input
            isRequired
            type="time"
            label="Time"
            defaultValue={new Date().toISOString().split('T')[1].slice(0, 5)}
            className="max-w-xs w-full" // Adjust width to full
          />
        </div>

        <div className="flex gap-4"> {/* Second row for new inputs */}
          <Select
          items=""
          label="Favorite Animal"
          placeholder="Select an animal"
          className="max-w-xs"
          >
          </Select>

          <Input
            isRequired
            type="text"
            label="IP"
            placeholder="Enter IP address"
            className="max-w-xs w-full" // Adjust width to full
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Enter your description"
          className="w-full" // Adjust width to full
        />
      </div>
    </div>
  );
}
