// Normalisation des données brutes de l'API (feuilles OpenSheet).

export const MEDAL_COLORS = ['or', 'argent', 'bronze'];

export const MEDAL_LABELS = { or: 'Or', argent: 'Argent', bronze: 'Bronze' };

export const SEASONS = [
  { value: 'ete', label: 'Été' },
  { value: 'hiver', label: 'Hiver' },
];

const clean = (value) => (value ?? '').toString().trim();

/** Médaille normalisée : champs en minuscules et liste d'identifiants d'athlètes. */
export const normalizeMedal = (raw) => ({
  id: clean(raw.id_medaille),
  color: clean(raw.couleur_medaille).toLowerCase(),
  season: clean(raw.hiver_ou_ete_medaille).toLowerCase(),
  sex: clean(raw.epreuve_sexe).toLowerCase(),
  discipline: clean(raw.discipline_medaille),
  event: clean(raw.epreuve_medaille),
  year: clean(raw.annee_medaille),
  city: clean(raw.ville_medaille),
  // Set : certaines lignes listent deux fois le même athlète
  athleteIds: [
    ...new Set(
      clean(raw.athletes_id_medaille)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ],
});

const toNumber = (value) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

/** Athlète normalisé : nom nettoyé, coordonnées numériques, liens. */
export const normalizeAthlete = (raw) => ({
  id: clean(raw.id_sportif),
  name: clean(raw.prenom_nom_sportif),
  gender: clean(raw.genre_sportif).toLowerCase(),
  birthDate: clean(raw.date_naissance_sportif),
  city: clean(raw.ville_sportif),
  department: clean(raw.departement_sportif),
  discipline: clean(raw.discipline_sportif),
  lat: toNumber(raw.ville_sportif_x),
  lng: toNumber(raw.ville_sportif_y),
  links: {
    wiki: clean(raw.wiki_sportif),
    site: clean(raw.site_sportif),
    instagram: clean(raw.insta_sportif),
    twitter: clean(raw.twitter_sportif),
    facebook: clean(raw.facebook_sportif),
    linkedin: clean(raw.linkedin_sportif),
  },
});

const uniqueSorted = (values, compare) => [...new Set(values.filter(Boolean))].sort(compare);
const byLocale = (a, b) => a.localeCompare(b, 'fr');
const byNumber = (a, b) => Number(a) - Number(b);

/** Options disponibles pour les filtres, dérivées des médailles. */
export const buildFilterOptions = (medals) => {
  const ofSeason = (season) => medals.filter((m) => m.season === season);
  return {
    disciplines: {
      ete: uniqueSorted(ofSeason('ete').map((m) => m.discipline), byLocale),
      hiver: uniqueSorted(ofSeason('hiver').map((m) => m.discipline), byLocale),
    },
    years: {
      ete: uniqueSorted(ofSeason('ete').map((m) => m.year), byNumber),
      hiver: uniqueSorted(ofSeason('hiver').map((m) => m.year), byNumber),
    },
  };
};

/** Décompte or / argent / bronze d'une liste de médailles. */
export const countByColor = (medals) => {
  const counts = { or: 0, argent: 0, bronze: 0 };
  for (const medal of medals) {
    if (medal.color in counts) counts[medal.color] += 1;
  }
  return counts;
};

/** Index identifiant d'athlète → médailles. */
export const indexMedalsByAthlete = (medals) => {
  const index = new Map();
  for (const medal of medals) {
    for (const id of medal.athleteIds) {
      if (!index.has(id)) index.set(id, []);
      index.get(id).push(medal);
    }
  }
  return index;
};
