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
        {/* Nytt Monetag Script-oppsett */}
        <Script id="monetag-ad-tag" strategy="afterInteractive">
          {`
            (function(s){
              s.dataset.zone='10391142';
              s.src='https://al5sm.com/tag.min.js';
            })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
          `}
        </Script>
        
        {children}
      </body>
    </html>
  );
}