import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Services', description: 'Conception CAO, conception et impression 3D, accompagnement technique. Tarifs sur devis.' };

const services = [
  {
    title: 'Conception 3D',
    text: 'Création ou reprise de modèles CAO : pièces fonctionnelles, boîtiers, mécanismes, prototypes. Vous recevez des fichiers prêts pour la fabrication.',
    items: ['Modélisation paramétrique sous SolidWorks', 'Modification d’un modèle existant', 'Fichiers STEP, STL, plans PDF', 'Conception adaptée à l’impression ou à l’usinage'],
  },
  {
    title: 'Conception et impression 3D',
    text: 'Le projet complet, du besoin à la pièce physique. Chaque pièce est vérifiée avant d’être remise.',
    items: ['Tout le volet conception', 'Impression FDM : PLA, PETG, ABS, TPU', 'Post-traitement et finitions', 'Contrôle dimensionnel'],
  },
  {
    title: 'Accompagnement technique',
    text: 'Pour un besoin encore flou : on analyse le problème ensemble et on choisit la solution la plus simple à fabriquer.',
    items: ['Analyse du besoin et des contraintes', 'Choix du matériau et du procédé', 'Préparation ou réparation de fichiers', 'Conseil avant fabrication'],
  },
];

export default function Services() {
  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>Services</h1>
          <p className="lead">Trois façons de travailler avec Nexora 3D. Chaque projet est chiffré sur devis, gratuitement, à partir de votre description.</p>
        </header>
        <div className="offers" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {services.map(s => (
            <article className="offer" key={s.title}>
              <h2 style={{ fontSize: '1.7rem' }}>{s.title}</h2>
              <p className="muted">{s.text}</p>
              <ul>{s.items.map(i => <li key={i}>{i}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className="formats">Tarifs sur devis. Le prix dépend de la complexité du modèle, du matériau, du volume imprimé et du délai souhaité.</p>
        <div className="actions" style={{ marginTop: 32 }}>
          <Link className="btn btn-primary" href="/quote">Décrire mon projet</Link>
          <Link className="btn btn-quiet" href="/portfolio">Voir des exemples</Link>
        </div>
      </div>
    </main>
  );
}
