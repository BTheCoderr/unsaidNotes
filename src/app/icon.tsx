import { ImageResponse } from "next/og";

import { pwaAppIconElement } from "@/lib/pwa-app-icon";

export const runtime = "edge";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** PWA / favicon — purple tile with “U” for Unsaid. */
export default function Icon() {
  return new ImageResponse(pwaAppIconElement(512), { ...size });
}
