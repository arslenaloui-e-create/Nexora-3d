'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Session = { role?: string } | null;

const links = [
  ['/services', 'Services'],
  ['/portfolio', 'Portfolio'],
  ['/about', 'À propos'],
  ['/faq', 'FAQ'],
  ['/contact', 'Contact'],
  ['/quote', 'Devis'],
] as const;

export default function SiteNav({ session, logoPath }: { session: Session; logoPath: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const spaceHref = session?.role === 'ADMIN' ? '/admin' : '/dashboard';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`nav ${scrolled ? 'navScrolled' : ''}`}>
      <div className="navProgress" style={{ width: `${progress}%` }} />
      <div className="container navin">
        <Link className="brand" href="/" aria-label="Nexora 3D accueil">
          <span className="brandMark"><img src={logoPath} alt="" /></span>
          <span>NEXORA <b>3D</b></span>
        </Link>

        <nav className="links" aria-label="Navigation principale">
          {links.map(([href, label]) => (
            <Link className={active(href) ? 'navActive' : ''} href={href} key={href}>{label}</Link>
          ))}
          {session ? (
            <Link className="btn navCta" href={spaceHref}>Mon espace <span aria-hidden="true">↗</span></Link>
          ) : (
            <Link className="btn btn-secondary navCta" href="/auth/login">Connexion <span aria-hidden="true">↗</span></Link>
          )}
        </nav>

        <div className="mobileNav">
          <button
            className="mobileNavToggle"
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
          {open && (
            <nav id="mobile-navigation" className="mobileNavPanel" aria-label="Navigation mobile">
              <div className="mobileNavLabel">NEXORA / NAVIGATION</div>
              {links.map(([href, label]) => <Link className={active(href) ? 'navActive' : ''} href={href} key={href}>{label}</Link>)}
              {session ? <Link className="btn" href={spaceHref}>Mon espace ↗</Link> : <Link className="btn btn-secondary" href="/auth/login">Connexion ↗</Link>}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
