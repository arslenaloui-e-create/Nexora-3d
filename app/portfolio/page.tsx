import { db } from '@/lib/db';
import PortfolioBrowser from '@/components/PortfolioBrowser';

export default async function Portfolio() {
  const items = await db.portfolioItem.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <main className="portfolioPage">
      <section className="section portfolioHero">
        <div className="container">
          <div className="portfolioHeroGrid">
            <div>
              <div className="eyebrow">NEXORA 3D / RÉALISATIONS</div>
              <h1>Des idées transformées en <span>objets réels.</span></h1>
              <p className="lead">
                Une sélection de travaux en conception mécanique, CAO, prototypage, impression 3D et robotique.
                Explorez les différentes vues et ouvrez chaque projet pour accéder à son dossier complet.
              </p>
            </div>
            <div className="portfolioHeroTelemetry" aria-label="Informations du portfolio">
              <div><span>PROJETS</span><strong>{String(items.length).padStart(2, '0')}</strong></div>
              <div><span>DOMAINES</span><strong>{String(new Set(items.map(item => item.category).filter(Boolean)).size).padStart(2, '0')}</strong></div>
              <div><span>MODE</span><strong>PUBLIC</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section portfolioSection">
        <div className="container">
          <PortfolioBrowser items={items} />
        </div>
      </section>
    </main>
  );
}
