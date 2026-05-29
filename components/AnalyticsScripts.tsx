import Script from "next/script";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

/**
 * Conditional analytics scripts — only injected when env vars are set.
 * Plausible: no consent required (cookieless, anonymized).
 * GA4: should be gated by consent in production (Funding Choices CMP).
 */
export function AnalyticsScripts() {
  return (
    <>
      {PLAUSIBLE_DOMAIN && (
        <Script
          strategy="afterInteractive"
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
        />
      )}
      {GA4_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
    </>
  );
}
