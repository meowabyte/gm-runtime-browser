import "./globals.css";

import type { Metadata } from "next";
import { Red_Hat_Display, Open_Sans } from "next/font/google"


const RedHatDisplayFont = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-redhatdisplay"
})

const OpenSansFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://gm-runtime-browser.vercel.app/"),
  title: "GM Runner Browser",
  description: "Browse through huge collection of GameMaker Studio 1 and 2 runners! Useful for porting and modding purposes.",
  creator: "meowabyte",
  keywords: ["gamemaker", "gamemaker studio", "gm", "gms", "gamemaker runner", "runners", "gamemaker studio runner", "gms runner", "gms 1 runner", "runner download", "gamemaker runner download", "gm 2 runner"],
  openGraph: {
    siteName: "GM Runner Browser",
    title: "GM Runner Browser",
    description: "Browse through huge collection of GameMaker Studio 1 and 2 runners! Useful for porting and modding purposes.",
    creators: "meowabyte",
    tags: ["gamemaker", "gamemaker studio", "gm", "gms", "gamemaker runner", "runners", "gamemaker studio runner", "gms runner", "gms 1 runner", "runner download", "gamemaker runner download", "gm 2 runner"],
    locale: "en-US",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${RedHatDisplayFont.variable} ${OpenSansFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
