import type { Metadata } from "next";
import "./globals.css";
import { RootProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Messenger",
  // description: "Generate by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
