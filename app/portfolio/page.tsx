import type { Metadata } from 'next';
import Link from 'next/link';
import PortfolioBrowser from '@/components/PortfolioBrowser';
import { getPortfolio } from '@/lib/portfolio';

export const metadata: Metadata = { title: 'Réalisations', description: 'Modèles CAO, pièces mécaniques et prototypes conçus par Nexora 3D.' };

export default async function Portfolio() {
  const items = await getPortfolio();
  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>Réalisations</h1>
          <p className="lead">Maquettes navales, mécanismes, robotique, objets connectés : chaque planche est un modèle conçu au studio. Ouvrez-en une pour voir toutes ses vues.</p>
        </header>
        {items.length ? <PortfolioBrowser items={items} /> : (
          <div className="empty">
            <strong>Le portfolio est en cours de mise à jour.</strong>
            <span>Pour voir des exemples proches de votre besoin, écrivez-nous.</span>
            <Link className="btn btn-quiet btn-sm" href="/contact">Nous contacter</Link>
          </div>
        )}
      </div>
    </main>
  );
}
