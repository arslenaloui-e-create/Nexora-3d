"use client";
import { useEffect, useState } from "react";
export default function Projects() {
  const [rows, setRows] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [m, setM] = useState("");
  async function load() {
    const [p, u] = await Promise.all([
      fetch("/api/admin/projects").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ]);
    setRows(p);
    setClients(u.filter((x: any) => x.role === "CLIENT"));
  }
  useEffect(() => {
    load();
  }, []);
  async function create(e: any) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(d),
    });
    const j = await r.json();
    setM(r.ok ? "Projet créé." : j.error || "Erreur");
    if (r.ok) {
      e.currentTarget.reset();
      load();
    }
  }
  async function change(x: any) {
    await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(x),
    });
    load();
  }
  return (
    <>
      <h1>Projets</h1>
      <form className="card form" onSubmit={create}>
        <h3>Nouveau projet</h3>
        <div className="field">
          <label>Client</label>
          <select name="clientId" required>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} — {c.email}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Titre</label>
          <input name="title" required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" required />
        </div>
        <button className="btn">Créer</button>
        {m && <div className="notice">{m}</div>}
      </form>
      <div className="tableWrap" style={{ marginTop: 20 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Projet</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>
                  {x.client.firstName} {x.client.lastName}
                </td>
                <td>{x.title}</td>
                <td>
                  <select
                    value={x.status}
                    onChange={(e) => change({ ...x, status: e.target.value })}
                  >
                    <option>DRAFT</option>
                    <option>IN_PROGRESS</option>
                    <option>REVIEW</option>
                    <option>COMPLETED</option>
                    <option>ARCHIVED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
