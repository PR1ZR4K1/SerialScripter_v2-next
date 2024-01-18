import React, { useState } from "react";
import { Input, Textarea, Select, Chip, SelectItem, Dropdown, DropdownTrigger, Button, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { FaRegFileAlt } from "react-icons/fa";
import { IncidentTag } from '@prisma/client';


interface TagsProps {
  tags: Set<string>;
  setTags: (keys: Set<string>) => void;
 }

export default function IncidentForm() {
  const [name, setName] = useState("My super duper bad incident!");
  const [ip, setIp] = useState("");
  const [hostname, setHostname] = useState("");
  const [attachment, setAttachment] = useState<File | undefined>();
  const [description, setDescription] = useState("");
  const [tags, setTags] = React.useState(new Set(["dog"]));

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // const formData = {
    //   name,
    //   ip,
    //   hostname,
    //   attachment,
    //   description,
    //   tags
    // };
    // console.log("Form Data:", {event});
    const formData = new FormData(event.currentTarget); // Create FormData from the form

  await fetch('/api/v1/add/incident', {
      method: 'POST',
      body: formData, // Pass formData as body
      // Don't set Content-Type header, the browser will set it with the correct boundary
    });
  }

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }
  
    setAttachment(target.files[0]);
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex justify-center items-center h-7xl w-7xl"> {/* Centering the form on the screen */}
      <div className="flex flex-col gap-4 w-4xl"> {/* Adding vertical stacking and gap */}
        <div className="flex gap-4"> {/* First row for inputs */}
          <Input
            isRequired
            name="name"
            type="text"
            label="Name"
            defaultValue="My super duper bad incident!"
            className="max-w-xs w-full" // Adjust width to full
          />
          <Input
            isRequired
            name="ip"
            type="text"
            label="IP"
            placeholder="Enter the IP"
            className="max-w-xs w-full" // Adjust width to full
          />
          <Input
            isRequired
            name="hostname"
            type="text"
            label="Hostname"
            placeholder="Enter the hostname"
            className="max-w-xs w-full" // Adjust width to full
          />
        </div>

        <div className="flex gap-4"> {/* Second row for new inputs */}
          <Tags tags={tags} setTags={setTags} />
        </div>

        <div className="flex flex-col gap-x-4 justify-center w-full">
          <input
            name="attachment"
            id="file-input"
            type="file"
            onChange={handleOnChange}
            className="hidden" // Adjust width to full
          />
          <label htmlFor="file-input" className="flex gap-x-4 w-full bg-[#27272A] h-16 rounded-md text-center justify-center items-center">
            <FaRegFileAlt className="h-10 w-5"/>
            Upload File Bozo:
            <p className="font-light">{attachment?.name || ''}</p>
          </label>
          
        </div>

        <Textarea
          name='description'
          label="Description"
          placeholder="Enter your description"
          className="w-full" // Adjust width to full
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </form>
  );
}

const Tags: React.FC<TagsProps> = ({ tags, setTags }) => {
  
    const incidentTagOptions = Object.entries(IncidentTag).map(([key, value]) => ({
        value: key,
        label: value.charAt(0).toUpperCase() + value.slice(1)
    }));

  
  const selectedValue = React.useMemo(
    () => Array.from(tags).join(", ").replaceAll("_", " "),
    [tags]
  );

  
  return (
    <div className="flex min-w-xl w-full flex-col gap-2">
      <Select
        name="tag"
        label="Tags"
        selectionMode="multiple"
        placeholder="Select tags"
        selectedKeys={tags}
        onSelectionChange={(keys) => setTags(keys as Set<string>)}
      >
        {incidentTagOptions.map((incidentTagOption) => (
          <SelectItem key={incidentTagOption.value} value={incidentTagOption.value}>
            {incidentTagOption.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
