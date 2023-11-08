import { ChevronDownIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { MenuHandler, Button, Avatar, MenuList, Typography, Menu, MenuItem } from "@material-tailwind/react";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import { logout } from '@/lib/userAuthentication';

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
                    className="flex justify-start items-center w-full gap-2 p-2 lg:ml-auto hover:bg-blue-200 hover:dark:bg-purple-900"
                >
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt="tania andrew"
                        className="border border-black dark:border-white p-0.5"
                        src="/assets/logo.png"
                    />
                    <Typography color='inherit' className='font-thin normal-case text-black dark:text-white'>
                        Administrator
                    </Typography>
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 grid place-items-center ml-auto justify-self-end transition-transform text-black dark:text-gray-200 ${isMenuOpen ? "rotate-[-90deg]" : ""
                            }`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-2 dark:bg-[#8C3F9B]">
                {profileMenuItems.map(({ label, icon, href }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    if (!isLastItem) {
                        return (
                            <Link href={href} key={label}>
                                <MenuItem
                                    onClick={closeMenu}
                                    className={`flex items-center gap-2 rounded hover:dark:bg-purple-900 border-none ${isLastItem
                                        ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10 dark:hover:bg-red-900 dark:focus:bg-red-900 dark:active:bg-red-900"
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
                    } else {

                        return (
                            <MenuItem
                                onClick={logout}
                                key={label}
                                className={`flex items-center gap-2 rounded dark:hover:bg-gray-600 ${isLastItem
                                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10 dark:hover:bg-red-900/60 dark:focus:bg-red-900/60 dark:active:bg-red-900/60"
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
                        );
                    }
                })}
            </MenuList>
        </Menu>
    );
}
