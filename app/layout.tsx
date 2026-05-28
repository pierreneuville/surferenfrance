import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surf-france.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Surf France — Prévisions vagues, houle & vent en temps réel",
    template: "%s · Surf France",
  },
  description:
    "Les meilleures prévisions de surf en France : 34 spots du Pays Basque à la Bretagne, scores de session quotidiens, meilleur créneau horaire, vagues, houle et vent.",
  keywords: [
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
    title: "Surf France — Trouvez où surfer aujourd'hui",
    description: "Les meilleurs spots de surf en France, avec un score de session quotidien et le meilleur créneau horaire.",
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Surf France",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surf France — Prévisions surf",
    description: "Score de session quotidien pour 34 spots français.",
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        {/* AdSense — décommenter une fois validé
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        */}
      </body>
    </html>
  );
}
