
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

export async function getPortfolio(): Promise<PortfolioEntry[]> {
  const rows = await db.portfolioItem.findMany({
    where: { visible: true },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  if (rows.length > 0) {
    return rows.map((r) => ({
      ...r,
      images: parseImages(r.images),
    }));
  }

  return PORTFOLIO_SEED.map((p) => ({
    ...p,
    id: null,
  }));
}
