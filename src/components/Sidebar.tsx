'use client';

import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";

import { GiScythe } from 'react-icons/gi'
import { PiLockKeyOpenFill } from "react-icons/pi";


import {
  HomeModernIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
  RectangleGroupIcon,
  FlagIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";


import Link from "next/link";
import { ProfileMenu } from './ProfileMenu'; 
import ThemeSwitcher from "./ThemeSwitcher";

export function SidebarWithLogo() {
  // const [open, setOpen] = React.useState(0);
  // const [openAlert, setOpenAlert] = React.useState(true);

  // const [tableOpen, setTableOpen] = React.useState(false);
  // const handleTableOpen = () => setTableOpen(!tableOpen);
 
  // const handleOpen = (value: number) => {
    // setOpen(open === value ? 0 : value);
  // };

  return (
    <Card variant="gradient" className=" h-screen max-w-[20rem] bg-gray-600/30 fixed top-0 left-0 shadow-2xl bg-gray-200 shadow-black dark:bg-[#141B29] rounded-md">
      <div className=" flex items-center gap-4 p-4 pt-6">
        <img src="/assets/logo.png" alt="brand" className="h-12 w-12" /> 
        <Typography variant="h5" color="blue-gray" className="text-black dark:text-gray-200">
          Serial Scripter
        </Typography>
      </div>
      <div className="flex justify-center my-2">
        <div className="w-5/6 h-1 border-t-1 border-blue-gray-300 dark:border-blue-gray-700 " />
      </div>
      <List className="flex gap-y-3">
        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/' href='/' className="flex items-center">
            <HomeModernIcon className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
                Dashboard
           </span>
          </Link>
        </button>
        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/cron' href='/cron' className="flex items-center">
            <RectangleGroupIcon className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              Cron
            </span>
          </Link>
        </button>
        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/pubkeyAuth' href='/pubkeyAuth' className="flex items-center">
            <PiLockKeyOpenFill className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              PubKey Auth
            </span>
          </Link>
        </button>
        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/scriptingHub' href='/scriptingHub' className="flex items-center">
            <GiScythe className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              Scripting Hub
            </span>
          </Link>
        </button>

        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/incidentReport' href='/incidentReport' className="flex items-center">
            <FlagIcon className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              Incident Report
            </span>
          </Link>
        </button>

        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/serverLogs' href='/serverLogs' className="flex items-center">
            <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              Server Logs
            </span>
          </Link>
        </button>

        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/apiKey' href='/apiKey' className="flex items-center">
            <Cog6ToothIcon className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              API Key
            </span>
          </Link>
        </button>

        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
          <Link as='/storage' href='/storage' className="flex items-center">
            <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-[#1D9FE4]" />
            <span className="ml-2 font-thin text-black dark:text-gray-200">
              Storage
            </span>
          </Link>
        </button>

      </List>
      
      <List className="flex justify-end h-full mb-6">
        <ListItem className='text-black hover:bg-blue-200 dark:text-gray-200 hover:dark:bg-purple-900'>
          <ThemeSwitcher />
        </ListItem>
        <ListItem className='text-black hover:bg-blue-200 dark:text-gray-200 hover:dark:bg-purple-900'>
          <ListItemPrefix>
            <ExclamationTriangleIcon className="h-7 w-7 text-yellow-900 dark:text-red-700" />
          </ListItemPrefix>
          Alerts
          <ListItemSuffix>
            <Chip value="14" size="sm" variant="ghost" color="red" className="rounded-full text-orange-900 dark:text-red-400" />
          </ListItemSuffix>
        </ListItem>
        {/* <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem> */}
        <ProfileMenu />
        {/* <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <Link as='/a' href='/login'>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </Link> */}
      </List>
      {/* <Alert open={openAlert} className="mt-auto w-56 m-6 dark:bg-white/60 dark:text-black" onClose={() => setOpenAlert(false)}>
        <CubeTransparentIcon className="mb-4 h-12 w-12 dark:text-black" />
        <Typography variant="h6" className="mb-1 dark:text-black">
          Welcome to Cyber Warden !
        </Typography>
        <Typography variant="small" className="font-normal opacity-80 dark:text-black">
          The capabilities of this platform are at you fingertips...
        </Typography>
        <div className="mt-4 flex gap-3">
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-medium opacity-80 dark:text-black"
            onClick={() => setOpenAlert(false)}
          >
            Dismiss
          </Typography>
          <Typography as="a" href="#" variant="small" className="font-medium dark:text-black">
            I&apos;m Excited
          </Typography>
        </div>
      </Alert> */}
    </Card>
  );
}