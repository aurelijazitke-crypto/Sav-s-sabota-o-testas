import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "„Geros mergaitės“ testas",
    short_name: "Geros mergaitės testas",
    description:
      "Savirefleksijos testas apie ribas, prisitaikymą ir grįžimą į savo pusę.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F0E6",
    theme_color: "#3E2436",
    lang: "lt"
  };
}
