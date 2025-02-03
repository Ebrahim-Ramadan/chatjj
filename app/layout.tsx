// api/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from 'sonner'
import React from 'react'
import {  checkAuthentication, getUserChats } from "@/app/actions";
import "./globals.css";
import { DeleteChatsWrapper } from "@/components/DeleteChatsWraper";
import { redirect } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  description: "talk to your local AI",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  title: {
    default: 'chatjj',
    template: `%s / chatjj`,
  },
  openGraph: {
    title: "chatjj",
    description: "Remove your background within milliseconds",
 
    url: "https://chatjj.netlify.app/",
    images: [
      {
        url: "https://chatjj.netlify.app/og",
        alt: "Remove your background within milliseconds",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@scoopsahoykid",
    title: "chatjj",
    description: "Remove your background within milliseconds",
    images: [
      {
        url: "https://chatjj.netlify.app/og",
        alt: "Remove your background within milliseconds",
      },
    ],
  },
};


export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const userID = await checkAuthentication();
console.log('layout root userID', userID);

if (!userID) {
  return redirect("/sign-in");
}
const userChats = await getUserChats(userID)
  return (
    <html lang="en">
      <head>
      <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Toaster position="top-center" richColors  theme="dark"/>
        {children}
      <DeleteChatsWrapper userChats={userChats} userID={userID} />

      </body>
    </html>
  );
}
