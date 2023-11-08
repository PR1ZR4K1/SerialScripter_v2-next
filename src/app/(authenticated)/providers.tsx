'use client'

import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from 'next-auth/react';

type Props = {
    children?: React.ReactNode
}


export const Providers = ({ children }: Props) => {
    return (

        <SessionProvider>
            <NextUIProvider>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="light"
                >
                    {children}
                </NextThemesProvider>
            </NextUIProvider>
        </SessionProvider>
    )
}
