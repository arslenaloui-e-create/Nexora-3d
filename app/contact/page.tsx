import type { Metadata } from 'next';
import { getSite } from '@/lib/site';
import ContactForm from './ContactForm';

export const metadata: Metadata = { title: 'Contact', description: 'Écrivez à Nexora 3D par formulaire, email, téléphone ou WhatsApp.' };

export default async function Contact() {
  const site = await getSite();
  const tel = (v: string) => `tel:${v.replace(/[^\d+]/g, '')}`;
  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>Contact</h1>
          <p className="lead">Une question, un projet à estimer, un fichier à vérifier ? Écrivez-nous, nous répondons en général sous 24 h.</p>
        </header>
        <div className="contact-grid">
          <ContactForm />
          <aside className="contact-aside" aria-label="Coordonnées">
            <a href={`mailto:${site.email}`}><span>Email</span><strong>{site.email}</strong></a>
            <a href={tel(site.phone)}><span>Téléphone</span><strong>{site.phone}</strong></a>
            <a href={tel(site.phone2)}><span>Téléphone 2</span><strong>{site.phone2}</strong></a>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><strong>Écrire sur WhatsApp</strong></a>
            <div><span>Atelier</span><strong>Tunis, Tunisie</strong></div>
            <p className="muted small" style={{ paddingTop: 16 }}>Pour un devis, le formulaire dédié permet de joindre vos fichiers et de suivre la réponse dans votre espace client.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
