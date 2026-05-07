import type { Metadata } from "next";

import "./globals.css";

const siteName = "Unsaid Notes";
const description =
  "A private AI reflection journal for hard conversations. Say it here before you say it out loud. Not therapy, legal advice, or crisis support.";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Say it here before you say it out loud`,
    template: `%s · ${siteName}`,
  },
  description,
  applicationName: siteName,
  openGraph: {
    title: siteName,
    description,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    /* Placeholder: replace with /opengraph-image.png after adding a real asset */
    images: [
      {
        url: "/icon.svg",
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
    images: ["/icon.svg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
