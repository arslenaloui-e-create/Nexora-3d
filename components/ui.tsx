import Link from 'next/link';
import { label, tone, PROJECT_PROGRESS } from '@/lib/labels';

export function Pill({ map, value }: { map: Record<string, string>; value: string }) {
  return <span className={`pill pill-${tone(value)}`}>{label(map, value)}</span>;
}

export function Progress({ status }: { status: string }) {
  const value = PROJECT_PROGRESS[status] ?? 0;
  return <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`Avancement ${value} %`}><span style={{ width: `${value}%` }} /></div>;
}

export function Empty({ title, text, href, action }: { title: string; text?: string; href?: string; action?: string }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {text && <span>{text}</span>}
      {href && action && <Link className="btn btn-quiet btn-sm" href={href}>{action}</Link>}
    </div>
  );
}

export function PageHead({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="app-head">
      <div><h1>{title}</h1>{text && <p className="muted">{text}</p>}</div>
      {children && <div className="actions">{children}</div>}
    </div>
  );
}
