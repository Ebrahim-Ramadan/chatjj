// api/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from 'sonner'
import React from 'react'
import "./globals.css";
import { DeleteChatsWrapper } from "@/components/DeleteChatsWraper";

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

export const viewport: Viewport = {
  themeColor: '#18181B', // This should match the theme_color in your manifest
};
export const metadata: Metadata = {
  manifest: "/manifest.json", // Link to the manifest file
  // themeColor: '#18181B', // This should match the theme_color in your manifest
  description: "talk to your local AI",
  icons: {
    icon: "/icons/icon.ico",
    shortcut: "/icons/icon.ico",
    apple: "/icons/icon.ico",
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
  // viewport:
  // "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
};


export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <head>
      {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Toaster position="top-center" richColors  theme="dark"/>
          {children}
          <DeleteChatsWrapper/>
      </body>
    </html>
  );
}
