"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const services = [
  "CAO",
  "Modélisation 3D",
  "Impression 3D",
  "Prototypage",
  "Conception mécanique",
  "Autre",
];
export default function Quote() {
  const [m, setM] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const r = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setM("");
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const files = fd
      .getAll("files")
      .filter((x) => x instanceof File && x.size > 0) as File[];
    const body = Object.fromEntries(
      [...fd.entries()].filter(([k]) => k !== "files"),
    );
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (res.status === 401) {
        r.push("/auth/login?next=/quote");
        return;
      }
      if (!res.ok) {
        setM(j.error || "Demande invalide.");
        return;
      }
      if (files.length) {
        const upload = new FormData();
        upload.append("requestId", j.id);
        files.forEach((file) => upload.append("files", file));
        const up = await fetch("/api/files", { method: "POST", body: upload });
        if (!up.ok) {
          const uj = await up.json().catch(() => ({}));
          setM(
            `Demande créée, mais les fichiers n'ont pas pu être envoyés : ${uj.error || "erreur inconnue"}`,
          );
          return;
        }
      }
      setM("Votre demande a bien été envoyée.");
      form.reset();
      setStep(1);
    } catch {
      setM("Impossible d’envoyer la demande pour le moment.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="eyebrow">Devis / 01—05</div>
          <h1>Décrivez votre projet</h1>
          <p className="lead">
            Un parcours guidé pour transmettre les informations techniques
            essentielles à NEXORA 3D.
          </p>
          <div className="card" style={{ maxWidth: 820, marginTop: 28 }}>
            <div className="quoteSteps" aria-label="Progression">
              <span className={step >= 1 ? "active" : ""}>01 Service</span>
              <span className={step >= 2 ? "active" : ""}>02 Projet</span>
              <span className={step >= 3 ? "active" : ""}>03 Fichiers</span>
              <span className={step >= 4 ? "active" : ""}>04 Client</span>
            </div>
            <form className="form" onSubmit={submit}>
              <div className="field">
                <label htmlFor="serviceType">Type de service</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  onChange={() => setStep(2)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choisir un service
                  </option>
                  {services.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="title">Titre du projet</label>
                <input
                  id="title"
                  name="title"
                  required
                  onFocus={() => setStep(2)}
                />
              </div>
              <div className="field">
                <label htmlFor="description">Description du besoin</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  minLength={10}
                  onFocus={() => setStep(2)}
                />
              </div>
              <div className="split">
                <div className="field">
                  <label htmlFor="dimensions">Dimensions</label>
                  <input
                    id="dimensions"
                    name="dimensions"
                    placeholder="Ex. 120 × 80 × 35 mm"
                  />
                </div>
                <div className="field">
                  <label htmlFor="quantity">Quantité</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                  />
                </div>
              </div>
              <div className="split">
                <div className="field">
                  <label htmlFor="material">Matériau</label>
                  <input
                    id="material"
                    name="material"
                    placeholder="Ex. PLA, PETG, aluminium…"
                  />
                </div>
                <div className="field">
                  <label htmlFor="tolerance">Précision / tolérance</label>
                  <input
                    id="tolerance"
                    name="tolerance"
                    placeholder="Ex. ±0,1 mm"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="files">Fichiers techniques</label>
                <input
                  id="files"
                  name="files"
                  type="file"
                  multiple
                  accept=".stl,.step,.stp,.sldprt,.sldasm,.obj,.3mf,.pdf,.zip,.png,.jpg,.jpeg,.webp"
                  onChange={() => setStep(3)}
                />
                <small className="muted">
                  Formats CAO, 3D, PDF et images autorisés selon la
                  configuration serveur.
                </small>
              </div>
              <div className="split">
                <div className="field">
                  <label htmlFor="budget">Budget indicatif (TND)</label>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="field">
                  <label htmlFor="deadline">Délai souhaité</label>
                  <input id="deadline" name="deadline" type="date" />
                </div>
              </div>
              <div className="notice">
                Vos coordonnées sont reprises depuis votre compte client. Vous
                pourrez compléter votre profil depuis votre espace.
              </div>
              <button className="btn" disabled={loading}>
                {loading ? "Envoi en cours…" : "Envoyer la demande"}
              </button>
              {m && <div className="notice">{m}</div>}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
