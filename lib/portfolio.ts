import { db } from './db';
import { PORTFOLIO_SEED, parseImages } from './portfolio-data';

export type PortfolioEntry = {
  id: string | null;
  title: string;
  description: string;
  category: string;
  technologies: string;
  tags: string;
  images: string[];
};

// Réalisations visibles, dans l'ordre choisi dans l'admin. Si la table est encore
// vide (seed pas lancé), on affiche les 11 vraies réalisations d'origine plutôt
// qu'une page vide ; elles n'ont pas de page détail tant qu'elles ne sont pas en base.
export async function getPortfolio(): Promise<PortfolioEntry[]> {
  const rows = await db.portfolioItem.findMany({ where: { visible: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  if (rows.length) return rows.map(r => ({ ...r, images: parseImages(r.images) }));
  if (await db.portfolioItem.count()) return [];
  return PORTFOLIO_SEED.map(p => ({ ...p, id: null }));
}
