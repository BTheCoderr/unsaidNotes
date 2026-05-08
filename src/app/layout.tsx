import type { Metadata, Viewport } from "next";

import { OfflineBanner } from "@/components/OfflineBanner";
import { PwaServiceWorkerRegister } from "@/components/PwaServiceWorkerRegister";

import "./globals.css";

const siteName = "Unsaid Notes";
const description =
  "A private AI reflection journal for hard conversations. Say it here before you say it out loud. Not therapy, legal advice, or crisis support.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7C3AED" },
    { media: "(prefers-color-scheme: dark)", color: "#5B21B6" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Say it here before you say it out loud`,
    template: `%s · ${siteName}`,
  },
  description,
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: siteName,
    description,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon",
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/icon"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen touch-manipulation">
        <OfflineBanner />
        <PwaServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
