import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'À propos', description: 'Nexora 3D, studio de conception mécanique, prototypage et impression 3D à Tunis.' };

export default function About() {
  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>À propos</h1>
          <p className="lead">Nexora 3D est un studio de conception mécanique, de prototypage et d’impression 3D basé à Tunis. La démarche est simple : comprendre le besoin, concevoir proprement, puis fabriquer une pièce réellement utilisable.</p>
        </header>
        <div className="space-list">
          <div><h3>Compétences</h3><p className="muted">Conception CAO sous SolidWorks, préparation de fichiers, prototypage et impression 3D. Certification CSWA (Certified SolidWorks Associate).</p></div>
          <div><h3>Un seul interlocuteur</h3><p className="muted">La personne qui modélise votre pièce est celle qui vous répond. Pas d’intermédiaire, pas d’information perdue.</p></div>
          <div><h3>Pensé pour la fabrication</h3><p className="muted">Chaque modèle tient compte des contraintes réelles : épaisseurs, tolérances, sens d’impression, assemblage.</p></div>
          <div><h3>Suivi transparent</h3><p className="muted">Devis, avancement, fichiers et messages restent disponibles dans votre espace client.</p></div>
        </div>
        <h2 style={{ marginTop: 64, marginBottom: 20 }}>La démarche</h2>
        <ol className="steps">
          <li><h3>Besoin</h3><p>Ce que la pièce doit faire, et dans quelles conditions.</p></li>
          <li><h3>Conception</h3><p>Modèle CAO et validation avec vous.</p></li>
          <li><h3>Fabrication</h3><p>Impression 3D et finitions.</p></li>
          <li><h3>Livraison</h3><p>Contrôle, puis remise de la pièce ou des fichiers.</p></li>
        </ol>
        <div className="actions" style={{ marginTop: 48 }}>
          <Link className="btn btn-primary" href="/quote">Demander un devis</Link>
          <Link className="btn btn-quiet" href="/portfolio">Voir les réalisations</Link>
        </div>
      </div>
    </main>
  );
}
