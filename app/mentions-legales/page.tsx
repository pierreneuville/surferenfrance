import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Mentions légales</h1>
      <div className="prose prose-invert mt-6 space-y-4 text-white/80">
        <h2 className="font-display text-xl font-bold">Éditeur</h2>
        <p>
          Yosurf — site édité par <strong>[Nom de l'éditeur]</strong>, [statut juridique], [adresse], [SIREN].
          Directeur de la publication : [Nom].
        </p>
        <p>Contact : <a href="mailto:contact@example.com" className="text-ocean-300 underline">contact@example.com</a></p>

        <h2 className="font-display text-xl font-bold">Hébergement</h2>
        <p>
          Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.
          <a className="ml-1 text-ocean-300 underline" href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a>
        </p>

        <h2 className="font-display text-xl font-bold">Propriété intellectuelle</h2>
        <p>
          Le contenu éditorial est protégé. Les données de prévisions sont fournies par
          <a className="ml-1 text-ocean-300 underline" href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo</a>
          sous licence CC BY 4.0.
        </p>

        <h2 className="font-display text-xl font-bold">Limitation de responsabilité</h2>
        <p>
          Les scores et prévisions sont indicatifs. La pratique du surf comporte des risques.
          L'éditeur ne saurait être tenu responsable d'un accident lié à l'usage des informations diffusées.
        </p>
      </div>
    </div>
  );
}
