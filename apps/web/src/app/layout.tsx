import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import GlobalAskArknoz from "@/components/GlobalAskArknoz";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arknoz.com"),

  title: {
    default: "Arknoz",
    template: "%s | Arknoz",
  },

  description:
    "Explore projects, products, knowledge, learning, opportunities and connections across the built world.",

  applicationName: "Arknoz",

  openGraph: {
    type: "website",
    siteName: "Arknoz",
    title: "Arknoz",
    description:
      "Explore projects, products, knowledge, learning, opportunities and connections across the built world.",
    images: [
      {
        url: "/brand/arknoz-logo.png",
        alt: "Arknoz",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Arknoz",
    description:
      "Explore projects, products, knowledge, learning, opportunities and connections across the built world.",
    images: ["/brand/arknoz-logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/brand/arknoz-logo.png",
    apple: "/brand/arknoz-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GlobalAskArknoz />
      </body>
    </html>
  );
}