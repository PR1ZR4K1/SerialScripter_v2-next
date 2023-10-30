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
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
} from "@material-tailwind/react";

import type { CardProps } from "@material-tailwind/react";

import {
  PresentationChartBarIcon,
  NewspaperIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ProfileMenu } from './ProfileMenu'; 
import ThemeSwitcher from "./ThemeSwitcher";
import { DialogCustomAnimation } from "./Dialoge";

export function SidebarWithLogo() {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const [tableOpen, setTableOpen] = React.useState(false);
  const handleTableOpen = () => setTableOpen(!tableOpen);
 
  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card variant="gradient" className="rounded-none h-screen w-7/8 max-w-[20rem] shadow-2xl shadow-black dark:bg-gradient-to-b dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src="/assets/logo.png" alt="brand" className="h-14 w-14" /> 
        <Typography variant="h5" color="blue-gray" className="dark:text-gray-200">
          Serial Scripter
        </Typography>
      </div>
      <List>
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform dark:text-gray-200 ${open === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0 hover:dark:bg-gray-600">
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5 dark:text-gray-400 " />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal dark:text-gray-200">
                Dashboard
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem className="dark:text-gray-200 hover:dark:bg-gray-600">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5 dark:text-gray-200"/>
                </ListItemPrefix>
                Analytics
              </ListItem>
              <ListItem className='dark:text-gray-200 hover:dark:bg-gray-600'>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5 dark:text-gray-200" />
                </ListItemPrefix>
                Reporting
              </ListItem>
              <ListItem className='dark:text-gray-200 hover:dark:bg-gray-600'>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5 dark:text-gray-200" />
                </ListItemPrefix>
                Projects
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform dark:text-gray-200 ${open === 2 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0 hover:dark:bg-gray-600">
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
              <ListItemPrefix>
                <NewspaperIcon className="h-5 w-5 dark:text-gray-400 " />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal dark:text-gray-200">
                Server Logs
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem className='dark:text-gray-200 hover:dark:bg-gray-600'>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5 dark:text-gray-200" />
                </ListItemPrefix>
                Orders
              </ListItem>
              <ListItem className='dark:text-gray-200 hover:dark:bg-gray-600'>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5 dark:text-gray-200" />
                </ListItemPrefix>
                Products
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <hr className="my-2 border-blue-gray-50" />
      </List>
      <List className="flex justify-end h-full mb-6">
        <ListItem className='dark:text-gray-200 hover:dark:bg-gray-600'>
          <ThemeSwitcher />
        </ListItem>
        <ListItem className='dark:text-gray-200 hover:dark:bg-gray-600'>
          <ListItemPrefix>
            <ExclamationTriangleIcon className="h-5 w-5 dark:text-yellow-900" />
          </ListItemPrefix>
          Alerts
          <ListItemSuffix>
            <Chip value="14" size="sm" variant="ghost" color="red" className="rounded-full dark:text-yellow-900" />
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
        <Link href='/login'>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </Link> */}
      </List>
      <Alert open={openAlert} className="mt-auto w-56 m-6" onClose={() => setOpenAlert(false)}>
        <CubeTransparentIcon className="mb-4 h-12 w-12" />
        <Typography variant="h6" className="mb-1">
          Welcome to Cyber Warden !
        </Typography>
        <Typography variant="small" className="font-normal opacity-80">
          The capabilities of this platform are at you fingertips...
        </Typography>
        <div className="mt-4 flex gap-3">
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-medium opacity-80"
            onClick={() => setOpenAlert(false)}
          >
            Dismiss
          </Typography>
          <Typography as="a" href="#" variant="small" className="font-medium">
            I'm Excited
          </Typography>
        </div>
      </Alert>
    </Card>
  );
}