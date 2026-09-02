import { RESULT_PROFILE_IDS } from "@/lib/quiz-types";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_TEST_URL || "https://testas.aurelijazitke.lt";

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1
    },
    ...RESULT_PROFILE_IDS.map((slug) => ({
      url: baseUrl + "/rezultatas/" + slug,
      changeFrequency: "yearly" as const,
      priority: 0.5
    }))
  ];
}
