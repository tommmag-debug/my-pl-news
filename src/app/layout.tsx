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
      <head>
        {/* Nytt Monetag Script med sone 10391161 */}
        <Script 
          src="https://3nbf4.com/act/files/tag.min.js?z=10391161" 
          data-cfasync="false" 
          async 
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}