import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yosurf — la carte des vagues",
    short_name: "Yosurf",
    description:
      "Yo, ta vague est prête. Score de session pour 400+ spots de surf en France, Espagne, Portugal, Maroc, UK et Irlande.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#061320",
    theme_color: "#061320",
    orientation: "portrait-primary",
    categories: ["sports", "weather", "travel"],
    lang: "fr-FR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
