import type { Metadata } from "next";
import "./globals.css";
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
  title: "GM Runtime Browser",
  description: "Browse through various GameMaker runtimes for various platforms!",
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
