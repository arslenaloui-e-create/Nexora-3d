'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string;
  tags: string;
  images: string;
};

function parseList(value: string, json = false): string[] {
  if (!value) return [];
  if (json) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
    } catch {}
    return [];
  }
  return value.split(',').map(x => x.trim()).filter(Boolean);
}

function ProjectImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`portfolioImageFallback ${className}`} aria-label="Aperçu indisponible">
        <span>NXR / 3D</span>
        <small>APERÇU INDISPONIBLE</small>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function ProjectCard({ item, index }: { item: PortfolioItem; index: number }) {
  const images = parseList(item.images, true);
  const tags = parseList(item.tags);
  const tech = parseList(item.technologies);
  const [active, setActive] = useState(0);
  const current = images[active] || '';

  const move = (direction: number) => {
    if (images.length < 2) return;
    setActive(value => (value + direction + images.length) % images.length);
  };

  return (
    <article className="portfolioProCard">
      <div className="portfolioProMedia">
        <div className="portfolioProImage">
          <ProjectImage src={current} alt={`${item.title} — vue ${active + 1}`} />
        </div>
        <div className="portfolioProOverlay" />
        <span className="portfolioProNumber">PROJECT / {String(index + 1).padStart(2, '0')}</span>
        <span className="portfolioProCategory">{item.category || 'Général'}</span>

        {images.length > 1 && (
          <>
            <button className="portfolioProArrow portfolioProPrev" type="button" onClick={() => move(-1)} aria-label="Image précédente">
              ‹
            </button>
            <button className="portfolioProArrow portfolioProNext" type="button" onClick={() => move(1)} aria-label="Image suivante">
              ›
            </button>
            <div className="portfolioProDots" aria-label="Vues du projet">
              {images.map((_, imageIndex) => (
                <button
                  key={imageIndex}
                  type="button"
                  className={imageIndex === active ? 'active' : ''}
                  aria-label={`Afficher la vue ${imageIndex + 1}`}
                  aria-pressed={imageIndex === active}
                  onClick={() => setActive(imageIndex)}
                />
              ))}
            </div>
          </>
        )}

        <span className="portfolioProView">{images.length || 0} vue{images.length > 1 ? 's' : ''}</span>
      </div>

      <div className="portfolioProBody">
        <div className="portfolioProEyebrow">
          <span>{item.category || 'Général'}</span>
          <span>{tech.slice(0, 2).join(' · ') || 'NEXORA 3D'}</span>
        </div>
        <h2>{item.title}</h2>
        <p>{item.description}</p>

        <div className="portfolioProTags">
          {(tags.length ? tags : tech).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
        </div>

        <div className="portfolioProActions">
          <Link href={`/portfolio/${item.id}`} className="btn btn-primary">Explorer le projet <span aria-hidden="true">↗</span></Link>
          {images.length > 0 && <span className="portfolioProIndex">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>}
        </div>
      </div>
    </article>
  );
}

export default function PortfolioBrowser({ items }: { items: PortfolioItem[] }) {
  const categories = useMemo(() => {
    const values = items.map(item => item.category?.trim()).filter(Boolean);
    return ['Tous', ...Array.from(new Set(values))];
  }, [items]);

  const [category, setCategory] = useState('Tous');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter(item => {
      const categoryMatch = category === 'Tous' || item.category === category;
      if (!categoryMatch) return false;
      if (!normalized) return true;
      return [item.title, item.description, item.category, item.technologies, item.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    });
  }, [items, category, query]);

  return (
    <div className="portfolioBrowser">
      <div className="portfolioControlBar">
        <div className="portfolioFilters" role="tablist" aria-label="Filtrer les projets">
          {categories.map(value => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={category === value}
              className={category === value ? 'active' : ''}
              onClick={() => setCategory(value)}
            >
              {value}
              <span>{value === 'Tous' ? items.length : items.filter(item => item.category === value).length}</span>
            </button>
          ))}
        </div>

        <label className="portfolioSearch">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Rechercher un projet..."
            aria-label="Rechercher un projet"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Effacer la recherche">×</button>}
        </label>
      </div>

      <div className="portfolioResultsMeta" aria-live="polite">
        <span><strong>{filtered.length}</strong> réalisation{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</span>
        {(category !== 'Tous' || query) && <button type="button" onClick={() => { setCategory('Tous'); setQuery(''); }}>Réinitialiser les filtres</button>}
      </div>

      {filtered.length > 0 ? (
        <div className="portfolioProGrid">
          {filtered.map((item, index) => <ProjectCard key={item.id} item={item} index={index} />)}
        </div>
      ) : (
        <div className="portfolioEmpty">
          <span className="portfolioEmptyCode">NXR / 404</span>
          <h2>Aucun projet trouvé</h2>
          <p>Modifiez votre recherche ou choisissez une autre catégorie.</p>
          <button className="btn btn-secondary" type="button" onClick={() => { setCategory('Tous'); setQuery(''); }}>Voir tous les projets</button>
        </div>
      )}
    </div>
  );
}
