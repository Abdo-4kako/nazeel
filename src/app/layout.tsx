import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
// جرب تغير المسار لنسبى لو لسه بيديك ايرور
import Navbar from "../components/Navbar"; 

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nazeel | Luxury Stay & Sanctuary",
  description: "Experience the world's most exquisite retreats, handpicked for the discerning traveler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased bg-[#FDFCFB] text-[#1A1A1A]`}
      >
        
        {children}
      </body>
    </html>
  );
}