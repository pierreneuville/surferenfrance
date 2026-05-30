import { buoysLlmsTxt } from "@/lib/llms";

export const revalidate = 3600;

export function GET() {
  return new Response(buoysLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
