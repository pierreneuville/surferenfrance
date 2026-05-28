import { ADSENSE_PUBLISHER_ID } from "@/lib/adsense";

export const dynamic = "force-static";

export function GET() {
  const body = ADSENSE_PUBLISHER_ID
    ? `google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0\n`
    : [
        "# ads.txt - renseigne NEXT_PUBLIC_ADSENSE_CLIENT pour générer la ligne AdSense",
        "# Exemple : google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0",
        "",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
