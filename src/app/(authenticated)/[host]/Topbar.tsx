'use client'

import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import { UsersIcon, CommandLineIcon, HomeIcon, Cog8ToothIcon, Bars3Icon, XCircleIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import { useHostsStore } from "@/store/HostsStore";
import { VscDebugDisconnect } from "react-icons/vsc";
import { TbFileImport } from "react-icons/tb";
import { FiCodesandbox } from "react-icons/fi";
import { FaRegLemon } from "react-icons/fa";


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
      <button onClick={() => setView('disks')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <CircleStackIcon className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18}/>
          <a className="flex items-center">
            Disks
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('connections')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <VscDebugDisconnect className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18}/>
          <a className="flex items-center">
            Connections
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('shares')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <TbFileImport className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18}/>
          <a className="flex items-center">
            Shares
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('containers')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <FiCodesandbox className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18}/>
          <a className="flex items-center">
            Containers
          </a>
        </Typography>
      </button>
      <button onClick={() => setView('firewall')}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium text-md dark:text-gray-200"
        >
          <FaRegLemon className="dark:text-[#1D9FE4] text-blue-600" height={18} width={18}/>
          <a className="flex items-center">
            Firewall
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
    <Navbar fullWidth className="flex w-[90%] bg-white/70 border-none dark:bg-purple-900 dark:border-black/30 py-4 rounded-3xl mt-6">
        { !openNav ? (
          <div className="container flex justify-center items-center min-w-full">

            <div className="hidden lg:block ">{navList}</div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
                <Bars3Icon className="h-6 w-6" />
            </IconButton>
          </div>
        )
        :  (
          <Collapse open={openNav} className="container flex justify-center items-center min-w-full">
            <div className="mx-auto ">
              {navList}
            </div>
            <IconButton
              variant="text"
              className=" h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
                <XCircleIcon className="h-6 w-6" />
            </IconButton>

          </Collapse>
        )}
    </Navbar>
  );
}