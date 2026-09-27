import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arknoz",
    short_name: "Arknoz",
    description:
      "Explore projects, products, knowledge, learning, opportunities and connections across the built world.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/brand/arknoz-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}