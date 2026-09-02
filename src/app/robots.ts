import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEST_URL || "https://testas.aurelijazitke.lt";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/rezultatas/"],
        disallow: ["/embed", "/api/", "/privatumas"]
      }
    ],
    sitemap: baseUrl + "/sitemap.xml"
  };
}
