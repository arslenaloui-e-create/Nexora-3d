import Link from "next/link";
import { notFound } from "next/navigation";

type LegalPage = {
  title: string;
  intro: string;
  sections: {
    title: string;
    content: string[];
  }[];
};

const pages: Record<string, LegalPage> = {
  "mentions-legales": {
    title: "Mentions légales",
    intro:
      "Les informations ci-dessous constituent la structure des mentions légales de Nexora 3D. Les informations d’identification doivent être complétées et validées par le propriétaire du site avant publication définitive.",
    sections: [
      {
        title: "Éditeur du site",
        content: [
          "Arslen Aloui",
          "Nexora 3D",
          "contactnexora3d@gmail.com",
          "Téléphone : +216 90 508 409",
        ],
      },
      {
        title: "Contact",
        content: [
          "Email : contactnexora3d@gmail.com",
          "Téléphone : +216 90 508 409",
        ],
      },
      {
        title: "Hébergement",
        content: [
          "Hébergeur : Railway",
          "Les informations juridiques et l’adresse de l’hébergeur doivent être complétées et vérifiées avant publication définitive.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        content: [
          "Les contenus présents sur ce site, notamment les textes, éléments graphiques, photographies, modèles, logos et éléments de marque, sont protégés par les règles applicables en matière de propriété intellectuelle.",
          "Toute reproduction, représentation ou réutilisation non autorisée peut être soumise à l’accord préalable du titulaire des droits concernés.",
        ],
      },
    ],
  },

  confidentialite: {
    title: "Politique de confidentialité",
    intro:
      "Cette page présente la structure de la politique de confidentialité de Nexora 3D. Elle doit être complétée et validée selon les traitements réellement effectués par l’entreprise.",
    sections: [
      {
        title: "Responsable du traitement",
        content: [
          "Arslen Aloui — Fondateur & Lead Ingénieur 3D de Nexora 3D. ",
          "Email : contactnexora3d@gmail.com",
        ],
      },
      {
        title: "Données susceptibles d’être collectées",
        content: [
          "Informations d’identité et de contact fournies lors de la création d’un compte.",
          "Informations relatives aux demandes de devis et aux projets.",
          "Fichiers transmis dans le cadre d’un projet.",
          "Messages et échanges effectués depuis la plateforme.",
          "Informations techniques nécessaires au fonctionnement et à la sécurité du service.",
        ],
      },
      {
        title: "Utilisation des données",
        content: [
          "Les données peuvent être utilisées pour créer et gérer un compte, traiter les demandes de devis, suivre les projets, assurer la communication avec les clients et assurer le fonctionnement et la sécurité de la plateforme.",
        ],
      },
      {
        title: "Droits des utilisateurs",
        content: [
          "Les utilisateurs peuvent exercer les droits applicables à leurs données personnelles selon la réglementation applicable.",
          "Pour toute demande : contactnexora3d@gmail.com",
        ],
      },
    ],
  },

  cgu: {
    title: "Conditions générales d’utilisation",
    intro:
      "Les présentes conditions définissent la structure des règles d’utilisation de la plateforme Nexora 3D. Elles doivent être juridiquement validées avant publication définitive.",
    sections: [
      {
        title: "Objet",
        content: [
          "Nexora 3D met à disposition une plateforme permettant notamment de présenter ses services, recevoir des demandes, transmettre des informations, gérer des devis et suivre des projets.",
        ],
      },
      {
        title: "Compte utilisateur",
        content: [
          "Certaines fonctionnalités nécessitent la création d’un compte.",
          "L’utilisateur est responsable de la confidentialité de ses identifiants et des actions réalisées depuis son compte.",
        ],
      },
      {
        title: "Utilisation de la plateforme",
        content: [
          "L’utilisateur s’engage à utiliser la plateforme de manière licite et à fournir des informations exactes lorsqu’elles sont nécessaires au traitement de sa demande.",
        ],
      },
      {
        title: "Fichiers transmis",
        content: [
          "L’utilisateur doit disposer des droits nécessaires sur les fichiers qu’il transmet à Nexora 3D.",
          "Les fichiers doivent être compatibles avec les conditions techniques et de sécurité de la plateforme.",
        ],
      },
      {
        title: "Disponibilité du service",
        content: [
          "Nexora 3D met en œuvre des moyens raisonnables pour assurer la disponibilité de la plateforme, sans garantir une disponibilité permanente ou sans interruption.",
        ],
      },
    ],
  },

  cgv: {
    title: "Conditions générales de vente",
    intro:
      "Cette page constitue la structure des conditions générales de vente de Nexora 3D. Les clauses commerciales et juridiques doivent être complétées et validées avant publication.",
    sections: [
      {
        title: "Objet",
        content: [
          "Les présentes conditions ont vocation à encadrer les prestations proposées par Nexora 3D, notamment les prestations de conception, modélisation, prototypage, fabrication et impression 3D lorsque celles-ci sont proposées.",
        ],
      },
      {
        title: "Devis",
        content: [
          "Les conditions de validité, la durée de validité et les modalités d’acceptation d’un devis sont celles indiquées sur le devis concerné.",
          "Les modalités commerciales définitives doivent être précisées par Nexora 3D.",
        ],
      },
      {
        title: "Prix et paiement",
        content: [
          "Les prix sont indiqués en Tunisie Dinar (TND) et s'entent de la prestation correspondante.",
        ],
      },
      {
        title: "Délais",
        content: [
          "Les délais applicables à une prestation doivent être indiqués dans le devis ou les documents contractuels correspondants.",
        ],
      },
    ],
  },

};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    return {
      title: "Page légale",
    };
  }

  return {
    title: page.title,
    description: `${page.title} — Nexora 3D`,
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="legal-page">
      <div className="wrap">
        <header className="legal-hero">
          <span className="legal-kicker">
            NEXORA 3D / INFORMATIONS LÉGALES
          </span>

          <h1>{page.title}</h1>

          <p>{page.intro}</p>
        </header>

        <div className="legal-layout">
          <aside className="legal-nav">
            <span>Documents</span>

            <Link
              className={
                slug === "mentions-legales"
                  ? "active"
                  : ""
              }
              href="/legal/mentions-legales"
            >
              Mentions légales
            </Link>

            <Link
              className={
                slug === "confidentialite"
                  ? "active"
                  : ""
              }
              href="/legal/confidentialite"
            >
              Confidentialité
            </Link>

            <Link
              className={
                slug === "cgu" ? "active" : ""
              }
              href="/legal/cgu"
            >
              CGU
            </Link>

            <Link
              className={
                slug === "cgv" ? "active" : ""
              }
              href="/legal/cgv"
            >
              CGV
            </Link>
          </aside>

          <article className="legal-content">
            {page.sections.map((section) => (
              <section
                className="legal-section"
                key={section.title}
              >
                <h2>{section.title}</h2>

                {section.content.map(
                  (paragraph, index) => (
                    <p key={`${section.title}-${index}`}>
                      {paragraph}
                    </p>
                  ),
                )}
              </section>
            ))}
          </article>
        </div>

        <div className="legal-back">
          <Link href="/">
            ← Retour à Nexora 3D
          </Link>
        </div>
      </div>
    </main>
  );
}