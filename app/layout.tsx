import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hachimi Blog Admin",
  description: "Admin system for managing Hachimi Blog",
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
