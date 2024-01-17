import React, { useState } from "react";
import { Input, Textarea, Select, Chip, SelectItem, Dropdown, DropdownTrigger, Button, DropdownItem, DropdownMenu } from "@nextui-org/react";


interface TagsProps {
  tags: Set<string>;
  setTags: (keys: Set<string>) => void;
 }

export default function IncidentForm() {
  const [name, setName] = useState("My super duper bad incident!");
  const [ip, setIp] = useState("");
  const [hostname, setHostname] = useState("");
  const [attach, setAttach] = useState<File | undefined>();
  const [description, setDescription] = useState("");
  const [tags, setTags] = React.useState(new Set(["dog"]));

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = {
      name,
      ip,
      attach,
      description,
      tags
    };
    console.log("Form Data:", formData);
    // Process formData here (e.g., send to a server)
  };

  function getLocalTime(timezoneOffset: number) {
    const now = new Date();
    const localTime = new Date(now.getTime() + timezoneOffset * 60000);
    return localTime.toISOString().split('T')[1].slice(0, 5);
  }

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }
  
    setAttach(target.files[0]);
  }
  

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-screen w-7xl"> {/* Centering the form on the screen */}
      <div className="flex flex-col gap-4 w-4xl"> {/* Adding vertical stacking and gap */}
        <div className="flex gap-4"> {/* First row for inputs */}
          <Input
            isRequired
            type="name"
            label="Name"
            defaultValue="My super duper bad incident!"
            className="max-w-xs w-full" // Adjust width to full
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            isRequired
            type="text"
            label="IP"
            placeholder="Enter the IP"
            className="max-w-xs w-full" // Adjust width to full
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <Input
            type="text"
            label="Hostname"
            placeholder="Enter the hostname"
            className="max-w-xs w-full" // Adjust width to full
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
        </div>

        <div className="flex gap-4"> {/* Second row for new inputs */}
          <Tags tags={tags} setTags={setTags} />
        </div>

        <div className="flex gap-4">
          <Input
            type="file"
            label="Attach"
            className="max-w-xs w-full" // Adjust width to full
            onChange={handleOnChange}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Enter your description"
          className="w-full" // Adjust width to full
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </form>
  );
}

const Tags: React.FC<TagsProps> = ({ tags, setTags }) => {
  const animals = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'fish', label: 'Fish' },
    { value: 'hamster', label: 'Hamster' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'snake', label: 'Snake' },
    { value: 'turtle', label: 'Turtle' },
    { value: 'lizard', label: 'Lizard' },
    { value: 'frog', label: 'Frog' }
  ];
  
  const selectedValue = React.useMemo(
    () => Array.from(tags).join(", ").replaceAll("_", " "),
    [tags]
  );

  return (
    <div className="flex min-w-xl w-full flex-col gap-2">
      <Select
        label="Favorite Animal"
        selectionMode="multiple"
        placeholder="Select an animal"
        selectedKeys={tags}
        onSelectionChange={(keys) => setTags(keys as Set<string>)}
      >
        {animals.map((animal) => (
          <SelectItem key={animal.value} value={animal.value}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}










function setFile(arg0: File) {
  throw new Error("Function not implemented.");
}

