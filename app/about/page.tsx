export default function About() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="eyebrow">À propos</div>
          <h1>Nexora 3D</h1>
          <p className="lead" style={{ maxWidth: 800 }}>
            Nexora 3D est un projet orienté conception mécanique, prototypage et
            impression 3D. La démarche privilégie la compréhension du besoin, la
            conception propre et la fabrication d'une pièce réellement
            exploitable.
          </p>
          <div className="grid3" style={{ marginTop: 30 }}>
            <div className="card">
              <h3>Compétences</h3>
              <p className="lead">
                Conception 3D, préparation de fichiers, prototypage et
                impression. Certification CSWA.
              </p>
            </div>
            <div className="card">
              <h3>Ma démarche</h3>
              <p className="lead">
                Besoin → analyse → conception → validation → fabrication →
                livraison.
              </p>
            </div>
            <div className="card">
              <h3>Pourquoi Nexora ?</h3>
              <p className="lead">
                Un interlocuteur unique et une attention portée aux contraintes
                réelles de fabrication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
