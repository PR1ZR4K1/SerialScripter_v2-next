import React, { useState } from "react";
import { Input, Textarea, Select, Chip, SelectItem } from "@nextui-org/react";


export default function IncidentForm() {
  const [name, setName] = useState("My super duper bad incident!");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toISOString().split('T')[1].slice(0, 5));
  const [ip, setIp] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = {
      name,
      date,
      time,
      ip,
      description,
      tags
    };
    console.log("Form Data:", formData);
    // Process formData here (e.g., send to a server)
  };



  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-screen"> {/* Centering the form on the screen */}
      <div className="flex flex-col gap-4"> {/* Adding vertical stacking and gap */}
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
          <Tags/>

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
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </div>
    </form>
  );
}

function Tags() {
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
  
  const [tags, setTags] = React.useState<string[]>([]);

  const handleAdd = (tag: string) => {
    setTags([...tags, tag]);
  };

  const handleRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Select
      label="Tags"
      placeholder="Select tags"
      selectionMode="multiple"
      className="max-w-xs"
    >
      {animals.map((animal) => (
        <SelectItem key={animal.value} value={animal.value}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
