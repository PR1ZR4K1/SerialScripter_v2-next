import { ChevronDownIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { MenuHandler, Button, Avatar, MenuList, Typography, Menu, MenuItem } from "@material-tailwind/react";
import Link from "next/link";
import React from "react";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    href: '#'
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
    href: '#'
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
    href: '#'
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
    href: '#'
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    href: '/login'
  },
];

export function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
  const closeMenu = () => setIsMenuOpen(false);
 
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="left-start" >
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex justify-start items-center w-full gap-2 p-2 lg:ml-auto dark:hover:bg-gray-600"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 dark:border-white p-0.5"
            src="/assets/logo.png"
          />
          <Typography color='inherit' className='font-thin normal-case dark:text-white'>
            Administrator
          </Typography>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 grid place-items-center ml-auto justify-self-end transition-transform dark:text-gray-200 ${
              isMenuOpen ? "rotate-[-90deg]" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-2 dark:bg-gradient-to-b dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
        {profileMenuItems.map(({ label, icon, href }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <Link href={href} key={label}>
                <MenuItem
                onClick={closeMenu}
                className={`flex items-center gap-2 rounded dark:hover:bg-gray-600 ${
                    isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                    : ""
                }`}
                >
                {React.createElement(icon, {
                    className: `h-4 w-4 dark:text-gray-400 ${isLastItem ? "text-red-500 dark:text-red-500" : ""}`,
                    strokeWidth: 2,
                })}
                <Typography
                    as="span"
                    variant="small"
                    className="font-normal dark:text-gray-200"
                    color={isLastItem ? "red" : "inherit"}
                >
                    {label}
                </Typography>
                </MenuItem>
            </Link>
          );
        })}
      </MenuList>
    </Menu>
  );
}