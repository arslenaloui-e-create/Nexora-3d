import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PortfolioGallery from '@/components/PortfolioGallery';
import { parseImages, parseList } from '@/lib/portfolio-data';

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const item = await db.portfolioItem.findUnique({ where: { id } });
  return item && item.visible ? item : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await load((await params).id);
  if (!item) return { title: 'Réalisation introuvable' };
  const images = parseImages(item.images);
  return { title: item.title, description: item.description.slice(0, 160), openGraph: { images: images.slice(0, 1) } };
}

export default async function PortfolioDetail({ params }: Props) {
  const item = await load((await params).id);
  if (!item) notFound();
  const images = parseImages(item.images);
  const tech = parseList(item.technologies);
  const tags = parseList(item.tags);

  return (
    <main className="page">
      <div className="wrap">
        <div className="detail-head">
          <Link className="link back small" href="/portfolio">Toutes les réalisations</Link>
          <div style={{ display: 'grid', gap: 12 }}>
            <h1>{item.title}</h1>
          </div>
          <span className="pill pill-accent">{item.category}</span>
        </div>
        <PortfolioGallery title={item.title} images={images} />
        <div className="detail-body">
          <p className="lead" style={{ color: 'var(--ink)' }}>{item.description}</p>
          <dl>
            <div><dt>Domaine</dt><dd>{item.category}</dd></div>
            {tech.length > 0 && <div><dt>Outils</dt><dd>{tech.join(', ')}</dd></div>}
            {tags.length > 0 && <div><dt>Thèmes</dt><dd>{tags.join(', ')}</dd></div>}
            <div><dt>Vues</dt><dd>{images.length}</dd></div>
          </dl>
        </div>
        <div className="actions" style={{ marginTop: 40 }}>
          <Link className="btn btn-primary" href="/quote">Demander un devis pour un projet similaire</Link>
          <Link className="btn btn-quiet" href="/portfolio">Retour aux réalisations</Link>
        </div>
      </div>
    </main>
  );
}
