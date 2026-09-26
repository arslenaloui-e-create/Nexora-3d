'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PortfolioGallery({ title, images }: { title: string; images: string[] }) {
  const validImages = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!validImages.length) {
    return <div className="portfolioDetailEmpty">Aucune vue n'est disponible pour ce projet.</div>;
  }

  const move = (direction: number) => setActive(value => (value + direction + validImages.length) % validImages.length);

  return (
    <>
      <div className="portfolioDetailGallery">
        <div className="portfolioDetailMain">
          {!failed ? (
            <img src={validImages[active]} alt={`${title} — vue ${active + 1}`} onError={() => setFailed(true)} />
          ) : (
            <div className="portfolioImageFallback"><span>NXR / 3D</span><small>APERÇU INDISPONIBLE</small></div>
          )}
          {validImages.length > 1 && (
            <>
              <button type="button" className="portfolioDetailArrow prev" onClick={() => move(-1)} aria-label="Image précédente">‹</button>
              <button type="button" className="portfolioDetailArrow next" onClick={() => move(1)} aria-label="Image suivante">›</button>
            </>
          )}
          <button type="button" className="portfolioDetailZoom" onClick={() => setLightbox(true)} aria-label="Agrandir l'image">⤢</button>
          <span className="portfolioDetailCounter">{active + 1} / {validImages.length}</span>
        </div>

        {validImages.length > 1 && (
          <div className="portfolioDetailThumbs" aria-label="Sélection des vues">
            {validImages.map((src, index) => (
              <button key={`${src}-${index}`} type="button" className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Vue ${index + 1}`}>
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="portfolioDetailLightbox" role="dialog" aria-modal="true" aria-label={`Galerie ${title}`}>
          <button className="portfolioDetailBackdrop" type="button" onClick={() => setLightbox(false)} aria-label="Fermer" />
          <div className="portfolioDetailLightboxInner">
            <div className="portfolioDetailLightboxTop">
              <span>NEXORA 3D / PROJECT VIEW</span>
              <button type="button" onClick={() => setLightbox(false)} aria-label="Fermer">×</button>
            </div>
            <img src={validImages[active]} alt={`${title} — vue ${active + 1}`} />
            {validImages.length > 1 && (
              <>
                <button type="button" className="portfolioDetailLightboxArrow prev" onClick={() => move(-1)} aria-label="Image précédente">‹</button>
                <button type="button" className="portfolioDetailLightboxArrow next" onClick={() => move(1)} aria-label="Image suivante">›</button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="portfolioDetailBack"><Link href="/portfolio">← Retour au portfolio</Link></div>
    </>
  );
}
