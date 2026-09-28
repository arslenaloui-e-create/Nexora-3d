'use client';

import Link from 'next/link';
import { useState } from 'react';

export type PlateItem = { id: string | null; title: string; category: string; technologies: string; images: string[] };

export function PlateImage({ src, alt, priority = false }: { src?: string; alt: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="img-missing">Aperçu indisponible</div>;
  return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}

// Une réalisation présentée comme une planche de dessin, avec son cartouche.
export default function Plate({ item }: { item: PlateItem }) {
  const tool = item.technologies.split(',')[0]?.trim() || 'CAO';
  const body = (
    <>
      <div className="plate-figure"><PlateImage src={item.images[0]} alt={item.title} /></div>
      <div className="cartouche">
        <div><span>{item.category}</span><strong>{item.title}</strong></div>
        <div><span>Vues</span><strong>{item.images.length}</strong></div>
        <div><span>Outil</span><strong>{tool}</strong></div>
      </div>
    </>
  );
  return item.id ? <Link className="plate" href={`/portfolio/${item.id}`}>{body}</Link> : <div className="plate">{body}</div>;
}
