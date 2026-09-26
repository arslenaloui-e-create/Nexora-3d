import Script from 'next/script';

const PAGE_MARKUP = String.raw`
<main>
<section class="hero">
<div class="container hero-grid">
<div><span class="badge"><i class="fa-solid fa-bolt"></i> Ingénierie 3D &amp; prototypage haute
                        précision</span>
<h1>De l'idée au <span>composant réel.</span></h1>
<p>La nouvelle plateforme NEXORA 3D centralise conception mécanique, modélisation CAO, prototypage
                        et suivi de projet dans une expérience pensée pour les créateurs, ingénieurs et entrepreneurs.
                    </p>
<div class="hero-actions"><a class="btn btn-primary" href="/quote">Lancer un projet <i class="fa-solid fa-arrow-right"></i></a><a class="btn btn-secondary" href="#portfolio">Explorer les réalisations</a></div>
<div class="metrics">
<div><strong>100%</strong><span>Sur mesure</span></div>
<div><strong>CAO</strong><span>Paramétrique</span></div>
<div><strong>3D</strong><span>FDM &amp; prototypage</span></div>
</div>
</div>
<div class="glass engine-card">
<div class="engine-top"><strong>NEXORA ENGINE</strong><i class="fa-solid fa-microchip" style="color:var(--primary)"></i></div>
<div class="engine-core"><i class="fa-solid fa-cubes"></i></div>
<div class="specs">
<div class="spec"><span>Matériaux</span><strong>PLA · PETG · ABS · TPU</strong></div>
<div class="spec"><span>Modélisation</span><strong>Paramétrique &amp; CAO</strong></div>
<div class="spec"><span>Statut</span><strong style="color:var(--success)">Opérationnel</strong>
</div>
</div>
</div>
</div>
</section>
<!-- <section id="comparison" class="section-padding">
        <div class="container">
            <div class="section-title">
                <span>Pourquoi un Humain ?</span>
                <h2>L'intelligence artificielle ne suffit pas. L'expertise fait la différence.</h2>
                <p>Découvrez pourquoi l'ingénierie humaine reste irremplaçable pour vos pièces mécaniques complexes.</p>
            </div>
            <div class="comparison-grid">
                <div class="comparison-card ai">
                    <div class="comparison-header">
                        <i class="fa-solid fa-robot"></i>
                        <h3>IA & Générateurs Automatiques</h3>
                    </div>
                    <ul class="comparison-list">
                        <li><i class="fa-solid fa-xmark"></i> Ignore les contraintes physiques réelles des matériaux (retrait, warping).</li>
                        <li><i class="fa-solid fa-xmark"></i> Génère des géométries non fabricables ou impossibles à assembler.</li>
                        <li><i class="fa-solid fa-xmark"></i> Aucune analyse des efforts mécaniques réels ou des tolérances d'ajustement.</li>
                        <li><i class="fa-solid fa-xmark"></i> Incapable de comprendre les subtilités d'un cahier des charges industriel.</li>
                    </ul>
                </div>
                <div class="comparison-card human">
                    <div class="comparison-header">
                        <i class="fa-solid fa-user-gear"></i>
                        <h3>L'Expertise Nexora Studio</h3>
                    </div>
                    <ul class="comparison-list">
                        <li><i class="fa-solid fa-check"></i> Maîtrise parfaite du comportement thermique et mécanique des plastiques.</li>
                        <li><i class="fa-solid fa-check"></i> Conception orientée fabrication (DFM) pour un résultat fiable à coup sûr.</li>
                        <li><i class="fa-solid fa-check"></i> Analyse approfondie des charges, des contraintes et des zones de faiblesse.</li>
                        <li><i class="fa-solid fa-check"></i> Échanges sur-mesure, conseils techniques et adaptation en temps réel.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section> -->
<section class="section" id="studio">
<div class="container">
<div class="section-title"><span class="eyebrow">NEXORA 3D PLATFORM</span>
<h2>Un espace unique pour piloter votre projet technique.</h2>
<p>Nous conservons l'exigence mécanique de NEXORA Studio et ajoutons une expérience numérique
                        complète : projets, fichiers, devis, messages et assistant technique.</p>
</div>
<div class="cards-4">
<div class="glass card">
<div class="service-icon"><i class="fa-solid fa-diagram-project"></i></div>
<h3>Projets</h3>
<p>Suivez les étapes, la progression et les livrables de chaque projet.</p>
</div>
<div class="glass card">
<div class="service-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
<h3>Fichiers</h3>
<p>Centralisez STL, STEP, PDF, images et documents techniques.</p>
</div>
<div class="glass card">
<div class="service-icon"><i class="fa-solid fa-comments"></i></div>
<h3>Messages</h3>
<p>Gardez les échanges techniques directement liés à vos projets.</p>
</div>
<div class="glass card">
<div class="service-icon"><i class="fa-solid fa-robot"></i></div>
<h3>NEXORA AI</h3>
<p>Un assistant dédié à la conception, au prototypage et à l'ingénierie.</p>
</div>
</div>
</div>
</section>
<section class="section" id="services">
<div class="container">
<div class="section-title"><span class="eyebrow">Nos offres</span>
<h2>De la conception à la pièce fonctionnelle.</h2>
<p>Une approche structurée adaptée à chaque niveau de besoin.</p>
</div>
<div class="cards-2">
<article class="glass card">
<div class="service-icon"><i class="fa-solid fa-pen-ruler"></i></div>
<h3>Conception 3D uniquement</h3>
<p>Modélisation paramétrique, fichiers STEP/STL, faisabilité, contraintes et optimisation pour
                            fabrication.</p>
<ul>
<li>CAO paramétrique</li>
<li>Analyse de faisabilité</li>
<li>DFM pour impression ou usinage</li>
</ul><a class="btn btn-secondary" href="/quote">Démarrer une demande</a>
</article>
<article class="glass card">
<div class="service-icon"><i class="fa-solid fa-cube"></i></div>
<h3>Conception + impression 3D</h3>
<p>Une solution clé en main, de l'idée à la pièce physique, avec contrôle qualité avant
                            livraison.</p>
<ul>
<li>PLA, PETG, ABS, TPU</li>
<li>Post-traitement</li>
<li>Contrôle qualité</li>
</ul><a class="btn btn-primary" href="/quote">Choisir le pack</a>
</article>
</div>
</div>
</section>
<section class="section" id="process">
<div class="container">
<div class="section-title"><span class="eyebrow">Méthodologie</span>
<h2>Votre projet en 4 étapes.</h2>
</div>
<div class="process">
<div class="glass step">
<div class="step-num">01</div>
<h3>Consultation</h3>
<p>Idée, croquis, dimensions ou cahier des charges.</p>
</div>
<div class="glass step">
<div class="step-num">02</div>
<h3>CAO</h3>
<p>Création du modèle paramétrique et validation.</p>
</div>
<div class="glass step">
<div class="step-num">03</div>
<h3>Fabrication</h3>
<p>Impression 3D et fabrication additive adaptée.</p>
</div>
<div class="glass step">
<div class="step-num">04</div>
<h3>Contrôle &amp; livraison</h3>
<p>Inspection, finitions et livraison du résultat.</p>
</div>
</div>
</div>
</section>
<section class="section portfolio-section" id="portfolio">
<div class="container">
<div class="section-title portfolio-heading">
<span class="eyebrow">Portfolio · Engineering Lab</span>
<h2>Les réalisations qui construisent NEXORA.</h2>
<p>Explorez nos conceptions 3D, études mécaniques et prototypes à travers des galeries pensées comme un véritable carnet d’ingénierie.</p>
</div>
<div class="portfolio-toolbar">
<div aria-label="Filtrer les réalisations" class="portfolio-filters" role="tablist">
<button aria-selected="true" class="filter active" data-filter="all" role="tab" type="button">Tous <span class="filter-count">11</span></button>
<button aria-selected="false" class="filter" data-filter="cad" role="tab" type="button">CAO</button>
<button aria-selected="false" class="filter" data-filter="print" role="tab" type="button">Impression 3D</button>
<button aria-selected="false" class="filter" data-filter="mech" role="tab" type="button">Mécanique</button>
</div>
<span class="portfolio-index"><span id="portfolioVisibleCount">11</span> réalisations</span>
</div>
<div class="portfolio-grid" id="portfolioGrid">
<article class="glass portfolio-card" data-category="cad" data-images="3" data-project="001">
<div class="portfolio-gallery" data-autoplay="4500" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Vue latérale de la frégate légère" data-gallery-image="" data-src="/images/fregate_legere_avec_helisurface_1_removebg_preview.png" type="button">
<img alt="Vue latérale de la frégate légère" loading="lazy" src="/images/fregate_legere_avec_helisurface_1_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Vue de la superstructure radar" data-gallery-image="" data-src="/images/fregate_legere_avec_helisurface_2_removebg_preview.png" type="button">
<img alt="Vue de la superstructure radar" loading="lazy" src="/images/fregate_legere_avec_helisurface_2_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Vue de l'hélisurface" data-gallery-image="" data-src="/images/fregate_legere_avec_helisurface_3_removebg_preview.png" type="button">
<img alt="Vue de l'hélisurface" loading="lazy" src="/images/fregate_legere_avec_helisurface_3_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">001</span>
<span class="portfolio-gallery-count">03 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">CAO</span><span class="portfolio-code">NAVAL · 001</span></div>
<h3>Frégate légère avec hélisurface</h3>
<p>Modèle 3D d’un navire avec superstructure radar, hélisurface et volumes étudiés pour une conception cohérente.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="cad" data-images="3" data-project="002">
<div class="portfolio-gallery" data-autoplay="4700" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Coque de vedette rapide à hydrojets" data-gallery-image="" data-src="/images/coque_de_vedette_rapide_a_hydrojets_1.png" type="button">
<img alt="Coque de vedette rapide à hydrojets" loading="lazy" src="/images/coque_de_vedette_rapide_a_hydrojets_1.png"/>
</button>
<button class="portfolio-image-button" data-alt="Vue arrière de la vedette à hydrojets" data-gallery-image="" data-src="/images/coque_de_vedette_rapide_a_hydrojets_2_removebg_preview.png" type="button">
<img alt="Vue arrière de la vedette à hydrojets" loading="lazy" src="/images/coque_de_vedette_rapide_a_hydrojets_2_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Vue détaillée de la coque" data-gallery-image="" data-src="/images/coque_de_vedette_rapide_a_hydrojets_3_removebg_preview.png" type="button">
<img alt="Vue détaillée de la coque" loading="lazy" src="/images/coque_de_vedette_rapide_a_hydrojets_3_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">002</span><span class="portfolio-gallery-count">03 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">CAO</span><span class="portfolio-code">NAVAL RC · 002</span></div>
<h3>Vedette rapide à hydrojets</h3>
<p>Coque RC avec trappe supérieure et double tuyère de propulsion, pensée pour un ensemble compact et dynamique.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="cad" data-images="4" data-project="003">
<div class="portfolio-gallery" data-autoplay="5000" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Radio-réveil connecté multifonction" data-gallery-image="" data-src="/images/radio_reveil_connecte_multifonction_1.png" type="button">
<img alt="Radio-réveil connecté multifonction" loading="lazy" src="/images/radio_reveil_connecte_multifonction_1.png"/>
</button>
<button class="portfolio-image-button" data-alt="Radio-réveil vue 2" data-gallery-image="" data-src="/images/radio_reveil_connecte_multifonction_2.png" type="button">
<img alt="Radio-réveil vue 2" loading="lazy" src="/images/radio_reveil_connecte_multifonction_2.png"/>
</button>
<button class="portfolio-image-button" data-alt="Radio-réveil vue 3" data-gallery-image="" data-src="/images/radio_reveil_connecte_multifonction_3.png" type="button">
<img alt="Radio-réveil vue 3" loading="lazy" src="/images/radio_reveil_connecte_multifonction_3.png"/>
</button>
<button class="portfolio-image-button" data-alt="Radio-réveil vue 4" data-gallery-image="" data-src="/images/radio_reveil_connecte_multifonction_4.png" type="button">
<img alt="Radio-réveil vue 4" loading="lazy" src="/images/radio_reveil_connecte_multifonction_4.png"/>
</button>
</div>
<span class="portfolio-project-no">003</span><span class="portfolio-gallery-count">04 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">CAO</span><span class="portfolio-code">IOT · 003</span></div>
<h3>Radio-réveil connecté</h3>
<p>Conception optimisée pour l’intégration de l’électronique, avec une enveloppe pensée autour des fonctions embarquées.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="print" data-images="2" data-project="004">
<div class="portfolio-gallery" data-autoplay="4400" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Drone aquatique" data-gallery-image="" data-src="/images/drone_aquatique1.png" type="button">
<img alt="Drone aquatique" loading="lazy" src="/images/drone_aquatique1.png"/>
</button>
<button class="portfolio-image-button" data-alt="Drone aquatique vue 2" data-gallery-image="" data-src="/images/drone_aquatique_2.png" type="button">
<img alt="Drone aquatique vue 2" loading="lazy" src="/images/drone_aquatique_2.png"/>
</button>
</div>
<span class="portfolio-project-no">004</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">IMPRESSION 3D</span><span class="portfolio-code">AQUATIQUE · 004</span></div>
<h3>Drone aquatique</h3>
<p>Châssis double coque profilé pour la stabilité, l’intégration des composants et une fabrication FDM accessible.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="mech" data-images="2" data-project="005">
<div class="portfolio-gallery" data-autoplay="4300" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Mécanisme de chaîne articulée à maillons" data-gallery-image="" data-src="/images/mecanisme_de_chaine_articulee_a_maillons_1_removebg_preview.png" type="button">
<img alt="Mécanisme de chaîne articulée à maillons" loading="lazy" src="/images/mecanisme_de_chaine_articulee_a_maillons_1_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Chaîne articulée vue 2" data-gallery-image="" data-src="/images/mecanisme_de_chaine_articulee_a_maillons_2_removebg_preview.png" type="button">
<img alt="Chaîne articulée vue 2" loading="lazy" src="/images/mecanisme_de_chaine_articulee_a_maillons_2_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">005</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">MÉCANIQUE</span><span class="portfolio-code">CINÉMATIQUE · 005</span></div>
<h3>Chaîne articulée à maillons</h3>
<p>Assemblage mécanique destiné à l’étude cinématique, au guidage et à la compréhension des liaisons entre composants.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="mech" data-images="2" data-project="006">
<div class="portfolio-gallery" data-autoplay="4600" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Pince préhenseuse robotique" data-gallery-image="" data-src="/images/pince_prehenseuse_robotique_1_removebg_preview.png" type="button">
<img alt="Pince préhenseuse robotique" loading="lazy" src="/images/pince_prehenseuse_robotique_1_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Pince robotique vue 2" data-gallery-image="" data-src="/images/pince_prehenseuse_robotique_2_removebg_preview.png" type="button">
<img alt="Pince robotique vue 2" loading="lazy" src="/images/pince_prehenseuse_robotique_2_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">006</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">MÉCANIQUE</span><span class="portfolio-code">ROBOTIQUE · 006</span></div>
<h3>Pince préhenseuse robotique</h3>
<p>Tête d’outil pour bras robotisé avec géométrie fonctionnelle et surfaces de préhension adaptées au mécanisme.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="cad" data-images="2" data-project="007">
<div class="portfolio-gallery" data-autoplay="5000" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="chaise" data-gallery-image="" data-src="/images/chaise.png" type="button">
<img alt="chaise" loading="lazy" src="/images/chaise.png"/>
</button>
<button class="portfolio-image-button" data-alt="Chaise 2" data-gallery-image="" data-src="/images/chaise2.png" type="button">
<img alt="Chaise 2" loading="lazy" src="/images/chaise2.png"/>
</button>
</div>
<span class="portfolio-project-no">007</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">CAO</span><span class="portfolio-code">IOT · 007</span></div>
<h3>Chaise Design</h3>
<p>Modélisation d'une chaise, axée sur l'ergonomie, la fluidité des lignes et l'optimisation des matériaux.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="cad" data-images="1" data-project="008">
<div class="portfolio-gallery" data-autoplay="5000" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Drone X-4" data-gallery-image="" data-src="/images/chassis_drone.png" type="button">
<img alt="Châssis Quadframe X-4" loading="lazy" src="/images/chassis_drone.png"/>
</button>
</div>
<span class="portfolio-project-no">008</span><span class="portfolio-gallery-count">01 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">CAO</span><span class="portfolio-code">UAV · 008</span></div>
<h3>Châssis Quadframe X-4</h3>
<p>Conception CAO d'une structure de drone en configuration « X ». Son design intègre des bras ajourés en treillis pour optimiser le rapport poids/rigidité</p>
</div>
</article>
<article class="glass portfolio-card" data-category="mech" data-images="2" data-project="009">
<div class="portfolio-gallery" data-autoplay="4600" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Jante 1" data-gallery-image="" data-src="/images/jante1_removebg_preview.png" type="button">
<img alt="Jante automobile — vue principale" loading="lazy" src="/images/jante1_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Jante 2" data-gallery-image="" data-src="/images/jante2_removebg_preview.png" type="button">
<img alt="Jante automobile — vue secondaire" loading="lazy" src="/images/jante2_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">009</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">MÉCANIQUE</span><span class="portfolio-code">AUTOMOBILE · 008</span></div>
<h3>Jante automobile</h3>
<p>Conception CAO d'une jante automobile réalisée sous SolidWorks, avec un accent sur la précision géométrique, l'esthétique et la faisabilité de fabrication.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="mech" data-images="2" data-project="010">
<div class="portfolio-gallery" data-autoplay="4600" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Piston 1" data-gallery-image="" data-src="/images/piston1_removebg_preview.png" type="button">
<img alt="Piston 1" loading="lazy" src="/images/piston1_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Piston 2" data-gallery-image="" data-src="/images/piston2_removebg_preview.png" type="button">
<img alt="Piston 2" loading="lazy" src="/images/piston2_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">010</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">MÉCANIQUE</span><span class="portfolio-code">MÉCANIQUE · 010</span></div>
<h3>Bloc 4 Pistons</h3>
<p>Modélisation 3D d'un bloc-cylindres, mettant en évidence les bielles et ajustements mécaniques internes.</p>
</div>
</article>
<article class="glass portfolio-card" data-category="mech" data-images="2" data-project="011">
<div class="portfolio-gallery" data-autoplay="4600" data-gallery="">
<div class="portfolio-slides">
<button class="portfolio-image-button is-active" data-alt="Piston 1" data-gallery-image="" data-src="/images/yamaha_removebg_preview.png" type="button">
<img alt="Moteur hors-bord Yamaha" loading="lazy" src="/images/yamaha_removebg_preview.png"/>
</button>
<button class="portfolio-image-button" data-alt="Piston 2" data-gallery-image="" data-src="/images/yamaha3_removebg_preview.png" type="button">
<img alt="Moteur hors-bord Yamaha" loading="lazy" src="/images/yamaha3_removebg_preview.png"/>
</button>
</div>
<span class="portfolio-project-no">011</span><span class="portfolio-gallery-count">02 vues</span>
<div class="portfolio-hover-label"><i class="fa-solid fa-expand"></i><span>Voir le projet</span></div>
<button aria-label="Image précédente" class="gallery-arrow gallery-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<button aria-label="Image suivante" class="gallery-arrow gallery-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
<div aria-label="Navigation de la galerie" class="gallery-dots"></div>
</div>
<div class="portfolio-info">
<div class="portfolio-meta"><span class="portfolio-category">MÉCANIQUE</span><span class="portfolio-code">MÉCANIQUE · 011</span></div>
<h3>Moteur Hors-Bord Yamaha</h3>
<p>Modélisation CAO haute précision, incluant la mécanique interne et les finitions de surface.</p>
</div>
</article>
</div>
</div>
</section>
<section class="section" id="faq">
<div class="container">
<div class="section-title"><span class="eyebrow">FAQ</span>
<h2>Questions fréquentes.</h2>
</div>
<div class="faq">
<div class="faq-item glass">
<button aria-expanded="false" class="faq-q" type="button">Quels fichiers acceptez-vous ?<i aria-hidden="true" class="fa-solid fa-chevron-down"></i></button>
<div class="faq-a">STL, STEP, STP, OBJ, PDF, PNG, JPG et fichiers CAO selon le projet.</div>
</div>
<div class="faq-item glass">
<button aria-expanded="false" class="faq-q" type="button">NEXORA AI est-elle disponible ?<i aria-hidden="true" class="fa-solid fa-chevron-down"></i></button>
<div class="faq-a">L’interface est prête. La fonction IA peut être activée côté Supabase Edge
                            Function lorsque le fournisseur et les clés serveur sont configurés.</div>
</div>
<div class="faq-item glass">
<button aria-expanded="false" class="faq-q" type="button">Mes données sont-elles réellement sécurisées ?<i aria-hidden="true" class="fa-solid fa-chevron-down"></i></button>
<div class="faq-a">Le mode démonstration local ne constitue pas une sécurité serveur. La version
                            production doit utiliser Supabase Auth, RLS, Database et Storage.</div>
</div>
</div>
</div>
</section>
<section class="section" id="contact">
<div class="container">
<div class="glass card" style="text-align:center;padding:50px"><span class="eyebrow">Prêt à construire
                        ?</span>
<h2 style="font-family:'Space Grotesk';font-size:2.6rem;margin:10px 0">Passez de l'idée au projet.
                    </h2>
<p class="muted">Créez votre espace NEXORA et centralisez votre prochaine conception.</p><a class="btn btn-primary" href="/quote">Demander un devis <i class="fa-solid fa-arrow-right"></i></a>
</div>
</div>
</section>
</main>
<footer class="footer">
<div class="container footer-grid">
<div class="footer-brand-col">
<a aria-label="NEXORA 3D — Accueil" class="brand footer-brand" href="/">
<span aria-hidden="true" class="brand-mark"><i class="fa-solid fa-cube"></i></span>
<span class="brand-copy"><strong>NEXORA</strong><small>3D ENGINEERING</small></span>
</a>
<p>__DESCRIPTION__</p>
<div class="footer-status"><span class="status-dot"></span> Studio opérationnel · Tunis, Tunisie</div>
</div>
<div class="footer-col">
<h3>Navigation</h3>
<a href="#studio">Studio</a>
<a href="#services">Nos offres</a>
<a href="#process">Processus</a>
<a href="#portfolio">Réalisations</a>
<a href="#faq">FAQ</a>
</div>
<div class="footer-col">
<h3>Plateforme</h3>
<a href="/auth/login">Espace client</a>
<a href="/portfolio">Projets</a>
<a href="/services">NEXORA AI</a>
<a href="/quote">Demander un devis</a>
<a href="/contact">Nous contacter</a>
</div>
<div class="footer-col footer-contact">
<h3>Contact</h3>
<a href="mailto:__EMAIL__"><i aria-hidden="true" class="fa-solid fa-envelope"></i> __EMAIL__</a>
<a href="tel:__PHONE_RAW__"><i aria-hidden="true" class="fa-solid fa-phone"></i> __PHONE__</a>
<a href="tel:__PHONE2_RAW__"><i aria-hidden="true" class="fa-solid fa-phone"></i> __PHONE2__</a>
<div aria-label="Réseaux sociaux" class="social-row">
<a aria-label="WhatsApp" href="https://wa.me/__WHATSAPP__" rel="noopener noreferrer" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
<a aria-label="LinkedIn" href="__LINKEDIN__" rel="noopener noreferrer" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a>
<a aria-label="Instagram" href="__INSTAGRAM__" rel="noopener noreferrer" target="_blank"><i class="fa-brands fa-instagram"></i></a>
</div>
</div>
</div>
<div class="container footer-bottom">
<span>© <span id="year"></span> NEXORA 3D. Tous droits réservés.</span>
<span>Engineering · CAO · Prototypage · Impression 3D</span>
</div>
</footer>
<a aria-label="Contacter NEXORA 3D sur WhatsApp" class="whatsapp-float" href="https://wa.me/__WHATSAPP__?text=Bonjour%20NEXORA%203D%2C%20je%20souhaite%20discuter%20d%27un%20projet." rel="noopener noreferrer" target="_blank">
<i aria-hidden="true" class="fa-brands fa-whatsapp"></i>
<span>WhatsApp</span>
</a>
<div aria-hidden="true" aria-labelledby="lightboxTitle" aria-modal="true" class="portfolio-lightbox" id="portfolioLightbox" role="dialog">
<div class="lightbox-backdrop" data-lightbox-close=""></div>
<div class="lightbox-shell">
<div class="lightbox-top">
<div>
<span class="lightbox-kicker">NEXORA 3D · PROJECT <strong id="lightboxProject">001</strong></span>
<h2 id="lightboxTitle">Réalisations</h2>
</div>
<div class="lightbox-tools">
<span class="lightbox-counter" id="lightboxCounter">1 / 1</span>
<button aria-label="Fermer" class="icon-button lightbox-close" data-lightbox-close="" type="button"><i class="fa-solid fa-xmark"></i></button>
</div>
</div>
<div class="lightbox-stage">
<button aria-label="Image précédente" class="icon-button lightbox-arrow lightbox-prev" type="button"><i class="fa-solid fa-chevron-left"></i></button>
<figure class="lightbox-figure">
<div class="lightbox-image-wrap"><img alt="" id="lightboxImage" src=""/></div>
<figcaption id="lightboxCaption"></figcaption>
</figure>
<button aria-label="Image suivante" class="icon-button lightbox-arrow lightbox-next" type="button"><i class="fa-solid fa-chevron-right"></i></button>
</div>
<div aria-label="Navigation de la visionneuse" class="lightbox-dots" id="lightboxDots"></div>
</div>
</div>
`;

const PAGE_SCRIPT = String.raw`  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Portfolio filters.
  const cards = $$(".portfolio-card");
  const filters = $$(".filter");
  const count = $("#portfolioVisibleCount");
  const applyFilter = (value) => {
    let visible = 0;
    cards.forEach(card => {
      const show = value === "all" || card.dataset.category === value;
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });
    if (count) count.textContent = String(visible).padStart(2,"0");
    filters.forEach(btn => {
      const active = btn.dataset.filter === value;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  };
  filters.forEach(btn => btn.addEventListener("click", () => applyFilter(btn.dataset.filter)));
  applyFilter("all");

  // Individual galleries.
  const galleryStates = new WeakMap();
  $$(".portfolio-gallery").forEach(gallery => {
    const buttons = $$("[data-gallery-image]", gallery);
    const prev = $(".gallery-prev", gallery);
    const next = $(".gallery-next", gallery);
    const dots = $(".gallery-dots", gallery);
    let index = Math.max(0, buttons.findIndex(b => b.classList.contains("is-active")));
    let timer = null;

    const render = (nextIndex, announce=true) => {
      if (!buttons.length) return;
      index = (nextIndex + buttons.length) % buttons.length;
      buttons.forEach((b,i) => {
        b.classList.toggle("is-active", i === index);
        b.setAttribute("aria-hidden", String(i !== index));
      });
      if (dots) $$(".gallery-dot", dots).forEach((d,i) => d.classList.toggle("active", i === index));
      if (prev) prev.disabled = buttons.length < 2;
      if (next) next.disabled = buttons.length < 2;
      if (announce && buttons.length > 1) gallery.setAttribute("aria-label", \`Vue \${index+1} sur \${buttons.length}\`);
    };

    buttons.forEach((b,i) => b.addEventListener("click", () => openLightbox(gallery, i)));
    if (dots) {
      buttons.forEach((_,i) => {
        const dot = document.createElement("button");
        dot.type = "button"; dot.className = "gallery-dot";
        dot.setAttribute("aria-label", \`Afficher la vue \${i+1}\`);
        dot.addEventListener("click", e => { e.stopPropagation(); render(i); restart(); });
        dots.appendChild(dot);
      });
    }
    prev?.addEventListener("click", e => { e.stopPropagation(); render(index-1); restart(); });
    next?.addEventListener("click", e => { e.stopPropagation(); render(index+1); restart(); });

    const delay = Number(gallery.dataset.autoplay) || 0;
    const restart = () => {
      if (timer) clearInterval(timer);
      if (!prefersReducedMotion && buttons.length > 1 && delay > 0) timer = setInterval(() => render(index+1, false), delay);
    };
    gallery.addEventListener("mouseenter", () => { if (timer) clearInterval(timer); });
    gallery.addEventListener("mouseleave", restart);
    galleryStates.set(gallery, {getIndex:()=>index, render, restart, buttons});
    render(index, false);
    restart();
  });

  // Lightbox.
  const lightbox = $("#portfolioLightbox");
  const lbImage = $("#lightboxImage");
  const lbCaption = $("#lightboxCaption");
  const lbProject = $("#lightboxProject");
  const lbTitle = $("#lightboxTitle");
  const lbCounter = $("#lightboxCounter");
  const lbDots = $("#lightboxDots");
  const lbPrev = $(".lightbox-prev");
  const lbNext = $(".lightbox-next");
  let activeGallery = null, activeIndex = 0, lastFocused = null;

  const lightboxData = () => {
    if (!activeGallery) return [];
    return $$("[data-gallery-image]", activeGallery);
  };

  const renderLightbox = () => {
    const items = lightboxData();
    if (!items.length) return;
    activeIndex = (activeIndex + items.length) % items.length;
    const item = items[activeIndex];
    const img = $("img", item);
    const card = item.closest(".portfolio-card");
    const title = $("h3", card)?.textContent.trim() || "Projet NEXORA 3D";
    const alt = item.dataset.alt || img?.alt || title;
    const src = item.dataset.src || img?.currentSrc || img?.src;
    lbImage.src = src;
    lbImage.alt = alt;
    lbCaption.textContent = alt;
    lbTitle.textContent = title;
    lbProject.textContent = String(card?.dataset.project || "001").padStart(3,"0");
    lbCounter.textContent = \`\${activeIndex + 1} / \${items.length}\`;
    lbPrev.disabled = items.length < 2;
    lbNext.disabled = items.length < 2;
    lbDots.innerHTML = "";
    items.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button"; dot.className = i === activeIndex ? "active" : "";
      dot.setAttribute("aria-label", \`Afficher la vue \${i+1}\`);
      dot.addEventListener("click", () => { activeIndex=i; renderLightbox(); });
      lbDots.appendChild(dot);
    });
  };

  function openLightbox(gallery, index) {
    activeGallery = gallery;
    activeIndex = index;
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden","false");
    document.body.classList.add("menu-open");
    $(".lightbox-close")?.focus();
  }

  const closeLightbox = () => {
    if (!lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden","true");
    document.body.classList.remove("menu-open");
    lbImage.removeAttribute("src");
    activeGallery = null;
    lastFocused?.focus?.();
  };

  lbPrev?.addEventListener("click", () => { activeIndex--; renderLightbox(); });
  lbNext?.addEventListener("click", () => { activeIndex++; renderLightbox(); });
  $$("[data-lightbox-close]").forEach(el => el.addEventListener("click", closeLightbox));

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && !lbPrev.disabled) { activeIndex--; renderLightbox(); }
    if (e.key === "ArrowRight" && !lbNext.disabled) { activeIndex++; renderLightbox(); }
  });

  // FAQ accordion — one open item at a time for a cleaner mobile experience.
  $$(".faq-item").forEach(item => {
    const q = $(".faq-q", item);
    q?.addEventListener("click", () => {
      const open = item.classList.contains("open");
      $$(".faq-item.open").forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          $(".faq-q", other)?.setAttribute("aria-expanded","false");
        }
      });
      item.classList.toggle("open", !open);
      q.setAttribute("aria-expanded", String(!open));
    });
  });

`;

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

type Props = {
  email: string; phone: string; phone2: string; whatsapp: string; linkedin: string; instagram: string; description: string;
};

export default function HomeLanding(props: Props) {
  const renderedMarkup = PAGE_MARKUP
    .replaceAll('__EMAIL__', escapeHtml(props.email))
    .replaceAll('__PHONE__', escapeHtml(props.phone))
    .replaceAll('__PHONE_RAW__', encodeURIComponent(props.phone.replace(/\s/g, '')))
    .replaceAll('__PHONE2_RAW__', encodeURIComponent(props.phone2.replace(/\s/g, '')))
    .replaceAll('__PHONE2__', escapeHtml(props.phone2))
    .replaceAll('__WHATSAPP__', encodeURIComponent(props.whatsapp.replace(/\D/g, '')))
    .replaceAll('__LINKEDIN__', escapeHtml(props.linkedin))
    .replaceAll('__INSTAGRAM__', escapeHtml(props.instagram))
    .replaceAll('__DESCRIPTION__', escapeHtml(props.description));
  return <>
    <div dangerouslySetInnerHTML={{ __html: renderedMarkup }} />
    <Script
      id="nexora-home-interactions"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: PAGE_SCRIPT }}
    />
  </>;
}
