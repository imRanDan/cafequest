"use client";

import { Providers } from "@/providers/Providers";
import Navbar from "@/components/Navbar";
import { Box } from "@chakra-ui/react";
import localFont from "next/font/local";
import {Analytics} from '@vercel/analytics/next'
import Footer from "@/components/Footer";
import Script from "next/script";


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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .mapboxgl-popup-content {
              padding: 0 !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
            }
            .mapboxgl-popup-tip {
              display: none !important;
            }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
 <Providers>
    <Box display="flex" flexDirection="column" minH="100vh" bg="white">
      <Navbar />
      <Box as="main" flex="1" bg="white">
        {children}
      </Box>
      <Footer />
    </Box>
      <Analytics />
  </Providers>
      </body>
    </html>
  );
}
