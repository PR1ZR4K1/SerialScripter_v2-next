import React from 'react';
import './globals.css';
import type { Metadata } from 'next'
import Providers from './providers';


import { SidebarWithLogo } from '@/components/Sidebar';

// maybe experiment with fonts from here (ctrl + click) should take u to a file where the font names are defined
import { Inter } from 'next/font/google'
import { FooterWithLogo } from '@/components/Footer';

// default root layout stuff
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Serial Scripter',
  description: 'Custom XDR written using Next.js',
}


// default root layout stuff
// type Theme = 'light' | 'dark';
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col bg-gradient-to-t from-blue-200 via-blue-100 to-gray-100 dark:bg-gradient-to-b dark:from-blue-gray-600 dark:via-gray-800 dark:to-blue-gray-800 relative`}>
        <Providers>
          <div className="flex h-full w-full">
            <SidebarWithLogo />
            <div className="h-screen w-full">
              {children}
            </div>
          </div>
          {/* <FooterWithLogo /> */}
        </Providers>
      </body>
    </html>
  );
} 
