'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = { href: string; label: string; count?: number };

export default function AppNav({ items, root }: { items: NavItem[]; root: string }) {
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === root ? pathname === root : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <nav className="app-nav" aria-label="Menu de l’espace">
      {items.map(i => (
        <Link key={i.href} href={i.href} aria-current={isCurrent(i.href) ? 'page' : undefined}>
          <span>{i.label}</span>
          {i.count ? <span className="count" aria-label={`${i.count} non lu${i.count > 1 ? 's' : ''}`}>{i.count > 99 ? '99+' : i.count}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
