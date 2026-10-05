import Link from 'next/link';
import Plate, { PlateImage, type PlateItem } from './Plate';
import type { Site } from '@/lib/site';
import Hero3DViewer from './Hero3DViewer';

type Faq = { id: string; question: string; answer: string };

// Traits de construction autour de la pièce (axes et cercle de centrage), dessinés une fois au chargement.
function ConstructionLines() {
  return (
    <svg className="constr" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <line className="axis" x1="0" y1="250" x2="600" y2="250" />
      <line className="axis" x1="300" y1="0" x2="300" y2="500" />
      <line x1="60" y1="40" x2="60" y2="70" /><line x1="45" y1="55" x2="75" y2="55" />
      <line x1="540" y1="430" x2="540" y2="460" /><line x1="525" y1="445" x2="555" y2="445" />
      <circle cx="300" cy="250" r="190" />
    </svg>
  );
}

export default function HomeLanding({ items, total, faqs, site }: { items: PlateItem[]; total: number; faqs: Faq[]; site: Site }) {
  const hero = items.find(i => i.images.length) || null;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Bonjour Nexora 3D, je souhaite parler d’un projet.')}`;

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="sheet hero-sheet">
            <div className="hero-grid">
              <div className="hero-copy">
                <h1>De l’idée au composant réel.</h1>
                <p className="lead">Nexora 3D conçoit vos pièces mécaniques en CAO, les prépare pour la fabrication et les imprime en 3D, à Tunis. Vous suivez chaque étape depuis votre espace client.</p>
                <div className="actions">
                  <Link className="btn btn-primary" href="/quote">Demander un devis</Link>
                  <Link className="btn btn-quiet" href="/portfolio">Voir les réalisations</Link>
                </div>
              </div>
              <div className="hero-figure">
                <Hero3DViewer />
              </div>
            </div>
            {hero && (
              <div className="cartouche">
                <div><span>Projet</span><strong>{hero.title}</strong></div>
                <div><span>Domaine</span><strong>{hero.category}</strong></div>
                <div><span>Outil</span><strong>{hero.technologies.split(',')[0] || 'CAO'}</strong></div>
                <div><span>Studio</span><strong>Nexora 3D, Tunis</strong></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="band" id="services">
        <div className="wrap">
          <div className="band-head">
            <div>
              <h2>Deux façons de travailler ensemble</h2>
              <p className="lead">Vous choisissez ce que vous voulez recevoir : les fichiers, ou la pièce finie.</p>
            </div>
          </div>
          <div className="offers">
            <article className="offer">
              <h3>Conception 3D</h3>
              <p className="muted">Vous repartez avec des fichiers prêts à fabriquer, chez nous ou ailleurs.</p>
              <ul>
                <li>Modélisation CAO paramétrique</li>
                <li>Analyse de faisabilité et des contraintes</li>
                <li>Fichiers STEP, STL et plans</li>
                <li>Optimisation pour l’impression ou l’usinage</li>
              </ul>
              <Link className="btn btn-quiet" href="/quote">Demander un devis de conception</Link>
            </article>
            <article className="offer">
              <h3>Conception et impression 3D</h3>
              <p className="muted">Vous repartez avec la pièce, contrôlée avant livraison.</p>
              <ul>
                <li>Tout le volet conception</li>
                <li>Impression FDM en PLA, PETG, ABS ou TPU</li>
                <li>Post-traitement et finitions</li>
                <li>Contrôle dimensionnel avant remise</li>
              </ul>
              <Link className="btn btn-primary" href="/quote">Demander un devis complet</Link>
            </article>
          </div>
          <p className="formats">Fichiers acceptés : STL, STEP, SolidWorks (SLDPRT, SLDASM), OBJ, 3MF, PDF, images et archives ZIP. Un croquis sur papier suffit aussi.</p>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head"><div><h2>Comment se passe un projet</h2></div></div>
          <ol className="steps">
            <li><h3>Vous décrivez le besoin</h3><p>Une idée, un croquis, des cotes ou un fichier existant suffisent pour commencer.</p></li>
            <li><h3>Nous modélisons</h3><p>Création du modèle CAO, puis validation avec vous avant toute fabrication.</p></li>
            <li><h3>Nous fabriquons</h3><p>Impression 3D avec le matériau adapté à l’usage réel de la pièce.</p></li>
            <li><h3>Contrôle et livraison</h3><p>Vérification, finitions, puis remise de la pièce ou des fichiers.</p></li>
          </ol>
        </div>
      </section>

      {items.length > 0 && (
        <section className="band" id="realisations">
          <div className="wrap">
            <div className="band-head">
              <div>
                <h2>Réalisations</h2>
                <p className="lead">Pièces mécaniques, maquettes navales, objets connectés : une sélection de modèles conçus au studio.</p>
              </div>
              <Link className="btn btn-quiet" href="/portfolio">Voir les {total} réalisations</Link>
            </div>
            <div className="plates">
              {items.slice(0, 6).map((item, i) => <Plate key={item.id || i} item={item} />)}
            </div>
          </div>
        </section>
      )}

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <div>
              <h2>Votre projet, suivi en ligne</h2>
              <p className="lead">Chaque client dispose d’un espace personnel. Tout ce qui concerne son projet s’y trouve.</p>
            </div>
            <Link className="btn btn-quiet" href="/auth/register">Créer mon espace</Link>
          </div>
          <div className="space-list">
            <div><h3>Devis</h3><p className="muted">Demandez un devis, recevez-le en PDF et acceptez-le en un clic.</p></div>
            <div><h3>Avancement</h3><p className="muted">Chaque projet affiche son statut et l’historique des étapes franchies.</p></div>
            <div><h3>Fichiers</h3><p className="muted">Envoyez vos STL, STEP ou plans, et récupérez les livrables au même endroit.</p></div>
            <div><h3>Messages</h3><p className="muted">Échangez directement avec le concepteur, sans perdre le fil dans vos emails.</p></div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="band">
          <div className="wrap">
            <div className="band-head">
              <div><h2>Questions fréquentes</h2></div>
              <Link className="btn btn-quiet" href="/faq">Toutes les questions</Link>
            </div>
            <div className="faq-list">
              {faqs.map(f => <details key={f.id}><summary>{f.question}</summary><p>{f.answer}</p></details>)}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2>Un croquis, un fichier ou juste une idée ?</h2>
            <p>Décrivez votre besoin : nous revenons vers vous avec une proposition chiffrée.</p>
          </div>
          <div className="actions">
            <Link className="btn btn-primary" href="/quote">Demander un devis</Link>
            <a className="btn btn-quiet" href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
  );
}
