import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque, Caveat } from "next/font/google";
import "./globals.css";
import { ADSENSE_CLIENT, ADSENSE_PUBLISHER_ID } from "@/lib/adsense";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { BackToTop } from "@/components/BackToTop";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EnvBanner } from "@/components/EnvBanner";
import { MilestoneToast } from "@/components/MilestoneToast";
import { OnboardingSheet } from "@/components/OnboardingSheet";
import { VersionWatcher } from "@/components/VersionWatcher";
import { InstallPrompt } from "@/components/InstallPrompt";
import { JsonLd } from "@/components/JsonLd";
import { LocaleProvider } from "@/lib/useLocale";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from "@/lib/seo";

const GTM_ID = "GTM-MN3B6ZBR";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const script = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "weather",
  keywords: [
    SITE_NAME,
    "surf France",
    "prévisions surf",
    "houle France",
    "météo surf",
    "score surf",
    "vagues",
    "Hossegor",
    "Biarritz",
    "Lacanau",
    "La Torche",
    "spots de surf",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} - ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — prévisions surf`,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-FR": SITE_URL,
      "en": `${SITE_URL}?lang=en`,
      "es-ES": `${SITE_URL}?lang=es`,
      "pt-PT": `${SITE_URL}?lang=pt`,
      "x-default": SITE_URL,
    },
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

// viewport-fit=cover is REQUIRED for env(safe-area-inset-*) to populate on iOS notched devices.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#061320",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["Yo Surf", "Yosurf France"],
        description: DEFAULT_DESCRIPTION,
        inLanguage: "fr-FR",
        publisher: { "@id": `${SITE_URL}#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/icon.svg"),
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}#app`,
        name: SITE_NAME,
        applicationCategory: "WeatherApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "fr-FR",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": `${SITE_URL}#organization` },
      },
    ],
  };

  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${sans.variable} ${display.variable} ${script.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title={`${SITE_NAME} LLM summary`} />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title={`${SITE_NAME} full LLM context`} />
        {/* Preconnect to critical 3rd-party origins for faster first paint */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="" />
        <link rel="preconnect" href="https://marine-api.open-meteo.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* AdSense site-ownership verification — works with the async script
            below AND lets Google verify ownership even if a tracker blocks pagead2. */}
        {ADSENSE_PUBLISHER_ID && (
          <meta name="google-adsense-account" content={`ca-${ADSENSE_PUBLISHER_ID}`} />
        )}
        {/* AdSense bootstrap — inlined directly in <head> (NOT via next/script) so the
            verification crawler sees it on the exact location Google demands ("between
            <head></head>"). next/script with afterInteractive often lands the tag in <body>,
            which made AdSense fail to detect ownership. */}
        {ADSENSE_CLIENT && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-sans flex min-h-screen flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <LocaleProvider>
          <JsonLd data={jsonLd} />
          <EnvBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AnalyticsScripts />
          <CookieBanner />
          <OnboardingSheet />
          <MilestoneToast />
          <VersionWatcher />
          <InstallPrompt />
          <BackToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
