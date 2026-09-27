import type { MetadataRoute } from "next";

const siteUrl = "https://arknoz.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
    "/explore",
    "/projects",
    "/products",
    "/knowledge",
    "/knowledge/books-publications",
    "/knowledge/research-innovation",
    "/knowledge/case-studies-solutions",
    "/knowledge/standards-references",
    "/knowledge/methods-practice",
    "/knowledge/ideas-insights",
    "/learning",
    "/opportunities",
    "/community",
    "/global",
    "/featured",
    "/people",
    "/organisations",
    "/places",
    "/universities",
    "/intelligence",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority:
      route === ""
        ? 1
        : ["/explore", "/projects", "/products", "/knowledge", "/global"].includes(route)
          ? 0.9
          : 0.7,
  }));
}
