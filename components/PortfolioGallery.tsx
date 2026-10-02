'use client';

import { useCallback, useEffect, useState } from 'react';
import { PlateImage } from './Plate';

export default function PortfolioGallery({ title, images }: { title: string; images: string[] }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const many = images.length > 1;
  const move = useCallback((d: number) => setActive(v => (v + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!zoom) return;
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false);
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); window.removeEventListener('keydown', onKey); };
  }, [zoom, move]);

  if (!images.length) return <div className="empty"><strong>Pas encore de vue pour ce projet.</strong></div>;
  const alt = `${title}, vue ${active + 1} sur ${images.length}`;

  return (
    <div className="viewer sheet">
      <div className="viewer-main">
        <button type="button" className="viewer-zoom" onClick={() => setZoom(true)} aria-label="Agrandir l’image">
          <PlateImage key={images[active]} src={images[active]} alt={alt} priority />
        </button>
        {many && <>
          <button type="button" className="viewer-nav prev" onClick={() => move(-1)} aria-label="Vue précédente">‹</button>
          <button type="button" className="viewer-nav next" onClick={() => move(1)} aria-label="Vue suivante">›</button>
        </>}
      </div>
      {many && (
        <div className="viewer-thumbs">
          {images.map((src, i) => (
            <button key={src + i} type="button" aria-current={i === active} aria-label={`Vue ${i + 1}`} onClick={() => setActive(i)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={e => e.target === e.currentTarget && setZoom(false)}>
          <img src={images[active]} alt={alt} />
          <button type="button" className="btn btn-quiet close" style={{ background: 'var(--sheet)' }} onClick={() => setZoom(false)} autoFocus>Fermer</button>
          {many && <>
            <button type="button" className="viewer-nav prev" onClick={() => move(-1)} aria-label="Vue précédente">‹</button>
            <button type="button" className="viewer-nav next" onClick={() => move(1)} aria-label="Vue suivante">›</button>
          </>}
        </div>
      )}
    </div>
  );
}
