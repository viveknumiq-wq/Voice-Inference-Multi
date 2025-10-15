import type { Metadata } from "next";
import Image from 'next/image';
import UVLogo from '@/public/UVHorizontal-White.svg';
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice AI Demo",
  description: "Demonstration of Voice AI Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}
