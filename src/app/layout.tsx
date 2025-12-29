import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
      <body className={`${geistSans.variable} antialiased`}>
        {/* Monetag Script flyttet til toppen av BODY for bedre kompatibilitet */}
        <Script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="197149" 
          data-cfasync="false" 
          strategy="afterInteractive" // Dette gjør at siden din laster lynraskt først
        />
        
        {children}
      </body>
    </html>
  );
}