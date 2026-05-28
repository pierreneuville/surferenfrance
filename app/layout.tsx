import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Caveat } from "next/font/google";
import "./globals.css";
import { AdSenseScript } from "@/components/AdSenseScript";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VersionWatcher } from "@/components/VersionWatcher";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yosurf.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yosurf — yo, ta vague est prête",
    template: "%s · Yosurf",
  },
  description:
    "Yosurf : la carte vivante des vagues françaises. 231 spots de la Côte d'Opale à la Corse, score de session, meilleur créneau du jour, vagues, houle et vent — gratuit, sans compte.",
  keywords: [
    "Yosurf",
    "surf France",
    "prévisions surf",
    "houle France",
    "vagues",
    "Hossegor",
    "Biarritz",
    "Lacanau",
    "La Torche",
    "spots de surf",
  ],
  openGraph: {
    title: "Yosurf — yo, ta vague est prête",
    description: "La carte vivante des vagues françaises. 231 spots, score du jour, meilleur créneau.",
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Yosurf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yosurf — la carte des vagues",
    description: "Score de session quotidien pour 231 spots français.",
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable} ${script.variable}`}>
      <body className="font-sans flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AdSenseScript />
        <CookieBanner />
        <VersionWatcher />
      </body>
    </html>
  );
}
