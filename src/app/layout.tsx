import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HoneyBee — Decentralized Honey Production",
  description: "An onchain idle game. Buy bees, upgrade your hive, and produce $HONEY tokens on the blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={pixelFont.variable}>
        {children}
      </body>
    </html>
  );
}
