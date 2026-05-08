import { ImageResponse } from "next/og";

import { pwaAppIconElement } from "@/lib/pwa-app-icon";

export const runtime = "edge";

/** 192×192 PNG for Web App Manifest (install prompts, home screen). */
export async function GET() {
  return new ImageResponse(pwaAppIconElement(192), {
    width: 192,
    height: 192,
  });
}
