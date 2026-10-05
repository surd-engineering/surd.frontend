import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const baticaSans = localFont({
  src: "./fonts/BaticaSans-VF.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-batica-sans",
  display: "swap",
});

export const fontVariables = `${plusJakartaSans.variable} ${geistMono.variable} ${baticaSans.variable}`;
