import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meet.AI - Intelligent Meeting Companion",
  description: "Transform your meetings with AI-powered transcription, summaries, and actionable insights. Enterprise-grade security with seamless integration.",
  keywords: ["AI meetings", "meeting transcription", "meeting summaries", "AI assistant", "productivity"],
  authors: [{ name: "Meet.AI Team" }],
  creator: "Meet.AI",
  publisher: "Meet.AI",
  metadataBase: new URL("https://meet-ai.com"),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Meet.AI - Intelligent Meeting Companion",
    description: "Transform your meetings with AI-powered transcription, summaries, and actionable insights.",
    url: "https://meet-ai.com",
    siteName: "Meet.AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet.AI - Intelligent Meeting Companion",
    description: "Transform your meetings with AI-powered transcription, summaries, and actionable insights.",
    creator: "@meetai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <TRPCProvider>
            <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
        </TRPCProvider>
  
  );
}
