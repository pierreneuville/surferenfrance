import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Politique de confidentialité</h1>
      <div className="prose prose-invert mt-6 space-y-4 text-white/80">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.</p>

        <h2 className="font-display text-xl font-bold">Données collectées</h2>
        <p>
          Yosurf ne demande aucune création de compte. Nous collectons uniquement
          les données suivantes, avec votre consentement explicite :
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Cookies de mesure d'audience (statistiques de visite anonymisées)</li>
          <li>Cookies publicitaires (Google AdSense ou équivalent), pour afficher des publicités pertinentes</li>
          <li>Géolocalisation, uniquement si vous activez la fonction "Près de moi" (jamais stockée côté serveur)</li>
        </ul>

        <h2 className="font-display text-xl font-bold">Vos droits (RGPD)</h2>
        <p>
          Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès,
          de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits,
          contactez-nous à <a className="text-ocean-300 underline" href="mailto:contact@example.com">contact@example.com</a>.
        </p>

        <h2 className="font-display text-xl font-bold">Gestion du consentement</h2>
        <p>
          Vous pouvez à tout moment retirer votre consentement via le module de consentement publicitaire
          affiché sur le site, ou en effaçant les cookies de votre navigateur.
        </p>

        <h2 className="font-display text-xl font-bold">Partenaires publicitaires</h2>
        <p>
          Nous utilisons Google AdSense pour diffuser de la publicité. Google peut déposer des cookies,
          sous réserve de votre consentement, pour personnaliser les annonces et mesurer leur performance.
          Plus d'informations sur
          <a className="ml-1 text-ocean-300 underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">les règles publicitaires Google</a>.
        </p>
      </div>
    </div>
  );
}
