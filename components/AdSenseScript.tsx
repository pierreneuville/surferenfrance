import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/adsense";

export function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
