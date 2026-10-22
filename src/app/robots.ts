import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/login",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog/", "/resources/", "/about/", "/events/"],
        disallow: ["/api/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
