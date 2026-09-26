import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PortfolioGallery from '@/components/PortfolioGallery';

function parseImages(value: string): string[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function list(value: string): string[] {
  return value.split(',').map(x => x.trim()).filter(Boolean);
}

export default async function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.portfolioItem.findUnique({ where: { id } });

  if (!item || !item.visible) notFound();

  const images = parseImages(item.images);
  const technologies = list(item.technologies);
  const tags = list(item.tags);

  return (
    <main className="portfolioDetailPage">
      <section className="section">
        <div className="container">
          <div className="portfolioDetailHeader">
            <div>
              <div className="eyebrow">NEXORA 3D / PROJET</div>
              <h1>{item.title}</h1>
              <p className="lead">{item.description}</p>
            </div>
            <div className="portfolioDetailMeta">
              <span>{item.category || 'Général'}</span>
              <strong>{String(images.length).padStart(2, '0')} VUES</strong>
            </div>
          </div>

          <PortfolioGallery title={item.title} images={images} />

          <div className="portfolioDetailInfo">
            <div className="portfolioDetailBlock">
              <span className="portfolioDetailLabel">DESCRIPTION</span>
              <p>{item.description}</p>
            </div>
            <div className="portfolioDetailBlock">
              <span className="portfolioDetailLabel">TECHNOLOGIES</span>
              <div className="portfolioDetailTags">
                {(technologies.length ? technologies : ['NEXORA 3D']).map(tag => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            {tags.length > 0 && (
              <div className="portfolioDetailBlock">
                <span className="portfolioDetailLabel">TAGS</span>
                <div className="portfolioDetailTags mutedTags">{tags.map(tag => <span key={tag}>#{tag}</span>)}</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
