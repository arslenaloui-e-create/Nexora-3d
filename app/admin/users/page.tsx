import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { ROLE, USER_STATUS, date } from '@/lib/labels';
import { PageHead, Pill } from '@/components/ui';
import UserToggle from './UserToggle';

export default async function Users() {
  const me = await pageUser('ADMIN');
  const rows = await db.user.findMany({ orderBy: [{ role: 'asc' }, { createdAt: 'desc' }], take: 500 });
  return (
    <>
      <PageHead title="Utilisateurs" text="Un compte désactivé ne peut plus se connecter ; ses données sont conservées." />
      <div className="table-wrap">
        <table className="table stack">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Email confirmé</th><th>Créé le</th><th><span className="skip">Actions</span></th></tr></thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id}>
                <td data-label="Nom"><strong>{u.firstName} {u.lastName}</strong>{u.id === me.id && <span className="sub">C’est vous</span>}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Rôle">{ROLE[u.role]}</td>
                <td data-label="Statut"><Pill map={USER_STATUS} value={u.status} /></td>
                <td data-label="Email confirmé">{u.emailVerifiedAt ? 'Oui' : 'Non'}</td>
                <td data-label="Créé le">{date(u.createdAt)}</td>
                <td data-label="">{u.id !== me.id && <UserToggle id={u.id} active={u.status === 'ACTIVE'} name={`${u.firstName} ${u.lastName}`} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
