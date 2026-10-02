'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Site } from '@/lib/site';

// Le pied de page et le bouton WhatsApp n'apparaissent que sur le site public,
// pas dans l'espace client ni dans l'administration.
export default function SiteFooter({ site }: { site: Site }) {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return null;
  const tel = (v: string) => `tel:${v.replace(/[^\d+]/g, '')}`;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Bonjour Nexora 3D, je souhaite parler d’un projet.')}`;

  return (
    <>
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <Link className="brand" href="/"><span className="brand-mark" style={{ backgroundImage: `url(${site.logoPath})` }} aria-hidden="true" /><span>NEXORA</span></Link>
              <p>{site.description}</p>
            </div>
            <div>
              <h2>Le studio</h2>
              <ul>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/portfolio">Réalisations</Link></li>
                <li><Link href="/about">À propos</Link></li>
                <li><Link href="/faq">Questions fréquentes</Link></li>
              </ul>
            </div>
            <div>
              <h2>Votre projet</h2>
              <ul>
                <li><Link href="/quote">Demander un devis</Link></li>
                <li><Link href="/auth/register">Créer un compte</Link></li>
                <li><Link href="/auth/login">Espace client</Link></li>
                <li><Link href="/contact">Nous écrire</Link></li>
              </ul>
            </div>
            <div>
              <h2>Contact</h2>
              <ul>
                <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
                <li><a href={tel(site.phone)}>{site.phone}</a></li>
                <li><a href={tel(site.phone2)}>{site.phone2}</a></li>
                <li><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Nexora 3D, Tunis</span>
            <span>Conception mécanique, CAO, prototypage et impression 3D</span>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Écrire à Nexora 3D sur WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" /></svg>
        <span>WhatsApp</span>
      </a>
    </>
  );
}
