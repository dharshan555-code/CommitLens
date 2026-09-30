import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommitLens — GitHub Repository Analytics",
  description: "Understand your GitHub repository through its development history."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}