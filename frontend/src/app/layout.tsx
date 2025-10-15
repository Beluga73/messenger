import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Messenger",
  description: "Generate by create next appd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
