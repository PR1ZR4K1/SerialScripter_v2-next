'use client'

import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

import { UsersIcon, CommandLineIcon, HomeIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { useHostsStore } from "@/store/HostsStore";

export default function Topbar({hostname}: {hostname: string}) {
  const [openNav, setOpenNav] = React.useState(false);
 
  const [setView] = useHostsStore((state) => [
    state.setView,
  ]);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);
 
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-1 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <button onClick={() => setView('home')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <HomeIcon className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18} />
  
          <a className="flex items-center">
            Home
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('services')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <Cog8ToothIcon className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18} />
          <a className="flex items-center">
            Services
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('users')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <UsersIcon className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18} />
          <a className="flex items-center">
            Users
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('xterm')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <CommandLineIcon className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18}/>
          <a className="flex items-center">
            xTerm
          </a>
        </Typography>
      </button>
    </ul>
  );
 


  return (
    <Navbar fullWidth className="flex w-[90%] bg-white/60 border-none dark:bg-black/5 dark:border-black/30 py-4 rounded-3xl mt-4">
      <div className="flex items-center text-blue-gray-900 absolute top-1/2 -translate-y-1/2 left-6">
        <Typography
          as="a"
          className="cursor-pointer py-1.5 font-bold whitespace-nowrap dark:text-white"
        >
          {hostname}
        </Typography>
      </div>
      <div className="container flex justify-center items-center min-w-full">

        <div className="hidden lg:block ">{navList}</div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      {openNav && (
        <Collapse open={openNav}>
          <div className="container ">
            {navList}
          </div>
        </Collapse>
      )}
    </Navbar>
  );
}