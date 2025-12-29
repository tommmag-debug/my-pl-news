import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Viktig import for annonser

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My PL News | Latest Premier League Updates",
  description: "Live news and standings from the English Premier League.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Dette er koden din fra Monetag, lagt inn rett etter head-tag åpning */}
        <Script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="197149" 
          async 
          data-cfasync="false" 
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}