import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/workspace/",
        "/team/",
        "/sign-in",
        "/access-denied",
        "/unavailable",
      ],
    },
    sitemap: "https://arknoz.com/sitemap.xml",
    host: "https://arknoz.com",
  };
}