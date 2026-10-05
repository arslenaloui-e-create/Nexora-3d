'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  ['/services', 'Services'],
  ['/portfolio', 'Réalisations'],
  ['/about', 'À propos'],
  ['/faq', 'FAQ'],
  ['/contact', 'Contact'],
] as const;

export default function SiteNav({ role, logoPath }: { role: 'ADMIN' | 'CLIENT' | null; logoPath: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const space = role === 'ADMIN' ? '/admin' : '/dashboard';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined);
  const account = role
    ? <Link className="btn btn-primary" href={space}>{role === 'ADMIN' ? 'Administration' : 'Mon espace'}</Link>
    : <Link className="btn btn-primary" href="/quote">Demander un devis</Link>;

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Nexora 3D, accueil">
          <span className="brand-mark" style={{ backgroundImage: `url(${logoPath})` }} aria-hidden="true" />
          <span>NEXORA</span>
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={current(href)}>{label}</Link>)}
          {!role && <Link href="/auth/login" aria-current={current('/auth/login')}>Connexion</Link>}
          {account}
          <ThemeToggle />
        </nav>
        <button className="menu-btn" type="button" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(v => !v)}>
          <span />
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" className="mobile-panel" aria-label="Navigation mobile">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>Accueil</Link>
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={current(href)}>{label}</Link>)}
          {!role && <Link href="/auth/login">Connexion</Link>}
          {account}
          <ThemeToggle />
        </nav>
      )}
    </header>
  );
}
