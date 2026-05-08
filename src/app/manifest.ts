import type { MetadataRoute } from "next";

const description =
  "Private AI reflection for hard conversations. Say it here before you say it out loud.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unsaid Notes",
    short_name: "Unsaid",
    description,
    start_url: "/?pwa_launch=1",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FAF7F2",
    theme_color: "#7C3AED",
    categories: ["lifestyle", "health"],
    icons: [
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
