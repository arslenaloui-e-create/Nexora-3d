// Les 11 réalisations réelles de Nexora 3D, reprises telles quelles de l'ancienne
// page d'accueil (textes et images de public/images). Elles servent à remplir la
// table PortfolioItem au premier seed ; ensuite tout se gère depuis Admin > Portfolio.
export type PortfolioSeed = {
  title: string;
  description: string;
  category: string;
  technologies: string;
  tags: string;
  images: string[];
};

export const PORTFOLIO_SEED: PortfolioSeed[] = [
  {
    title: 'Frégate légère avec hélisurface',
    description: 'Modèle 3D d’un navire avec superstructure radar, hélisurface et volumes étudiés pour une conception cohérente.',
    category: 'CAO', technologies: 'SolidWorks', tags: 'naval, maquette',
    images: ['/images/fregate_legere_avec_helisurface_1_removebg_preview.png', '/images/fregate_legere_avec_helisurface_2_removebg_preview.png', '/images/fregate_legere_avec_helisurface_3_removebg_preview.png'],
  },
  {
    title: 'Vedette rapide à hydrojets',
    description: 'Coque RC avec trappe supérieure et double tuyère de propulsion, pensée pour un ensemble compact et dynamique.',
    category: 'CAO', technologies: 'SolidWorks', tags: 'naval, RC',
    images: ['/images/coque_de_vedette_rapide_a_hydrojets_1.png', '/images/coque_de_vedette_rapide_a_hydrojets_2_removebg_preview.png', '/images/coque_de_vedette_rapide_a_hydrojets_3_removebg_preview.png'],
  },
  {
    title: 'Radio-réveil connecté',
    description: 'Conception optimisée pour l’intégration de l’électronique, avec une enveloppe pensée autour des fonctions embarquées.',
    category: 'CAO', technologies: 'SolidWorks', tags: 'objet connecté, boîtier',
    images: ['/images/radio_reveil_connecte_multifonction_1.png', '/images/radio_reveil_connecte_multifonction_2.png', '/images/radio_reveil_connecte_multifonction_3.png', '/images/radio_reveil_connecte_multifonction_4.png'],
  },
  {
    title: 'Drone aquatique',
    description: 'Châssis double coque profilé pour la stabilité, l’intégration des composants et une fabrication FDM accessible.',
    category: 'Impression 3D', technologies: 'SolidWorks, FDM', tags: 'drone, aquatique',
    images: ['/images/drone_aquatique1.png', '/images/drone_aquatique_2.png'],
  },
  {
    title: 'Chaîne articulée à maillons',
    description: 'Assemblage mécanique destiné à l’étude cinématique, au guidage et à la compréhension des liaisons entre composants.',
    category: 'Mécanique', technologies: 'SolidWorks', tags: 'cinématique, assemblage',
    images: ['/images/mecanisme_de_chaine_articulee_a_maillons_1_removebg_preview.png', '/images/mecanisme_de_chaine_articulee_a_maillons_2_removebg_preview.png'],
  },
  {
    title: 'Pince préhenseuse robotique',
    description: 'Tête d’outil pour bras robotisé avec géométrie fonctionnelle et surfaces de préhension adaptées au mécanisme.',
    category: 'Mécanique', technologies: 'SolidWorks', tags: 'robotique, préhension',
    images: ['/images/pince_prehenseuse_robotique_1_removebg_preview.png', '/images/pince_prehenseuse_robotique_2_removebg_preview.png'],
  },
  {
    title: 'Chaise design',
    description: 'Modélisation d’une chaise, axée sur l’ergonomie, la fluidité des lignes et l’optimisation des matériaux.',
    category: 'CAO', technologies: 'SolidWorks', tags: 'mobilier, ergonomie',
    images: ['/images/chaise.png', '/images/chaise2.png'],
  },
  {
    title: 'Châssis Quadframe X-4',
    description: 'Conception CAO d’une structure de drone en configuration « X ». Les bras ajourés en treillis optimisent le rapport poids/rigidité.',
    category: 'CAO', technologies: 'SolidWorks', tags: 'drone, structure',
    images: ['/images/chassis_drone.png'],
  },
  {
    title: 'Jante automobile',
    description: 'Conception CAO d’une jante automobile sous SolidWorks, avec un accent sur la précision géométrique, l’esthétique et la faisabilité de fabrication.',
    category: 'Mécanique', technologies: 'SolidWorks', tags: 'automobile',
    images: ['/images/jante1_removebg_preview.png', '/images/jante2_removebg_preview.png'],
  },
  {
    title: 'Bloc 4 pistons',
    description: 'Modélisation 3D d’un bloc-cylindres, mettant en évidence les bielles et les ajustements mécaniques internes.',
    category: 'Mécanique', technologies: 'SolidWorks', tags: 'moteur, assemblage',
    images: ['/images/piston1_removebg_preview.png', '/images/piston2_removebg_preview.png'],
  },
  {
    title: 'Moteur hors-bord Yamaha',
    description: 'Modélisation CAO haute précision, incluant la mécanique interne et les finitions de surface.',
    category: 'Mécanique', technologies: 'SolidWorks', tags: 'moteur, naval',
    images: ['/images/yamaha_removebg_preview.png', '/images/yamaha3_removebg_preview.png'],
  },
];

export function parseImages(value: string): string[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : [];
  } catch {
    return [];
  }
}

export function parseList(value: string): string[] {
  return (value || '').split(',').map(x => x.trim()).filter(Boolean);
}
