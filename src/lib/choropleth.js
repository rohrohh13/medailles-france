// Classes de couleur pour la carte des départements.

export const CHOROPLETH_COLORS = ['#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c', '#08306b'];
const EMPTY_COLOR = '#f4f5f7';

/** Construit des classes (min, max, couleur) à partir des effectifs par département. */
export const buildClasses = (countsByDept) => {
  const counts = Object.values(countsByDept).filter((c) => c > 0);
  if (!counts.length) return [];

  const numClasses = CHOROPLETH_COLORS.length;
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  // Petit effectif : une classe par valeur
  if (maxCount <= numClasses) {
    return Array.from({ length: maxCount }, (_, i) => ({
      min: i + 1,
      max: i + 1,
      color: CHOROPLETH_COLORS[i],
    }));
  }

  // Classes logarithmiques sans chevauchement ni trou
  const logMin = Math.log(minCount || 1);
  const step = (Math.log(maxCount) - logMin) / numClasses;
  const classes = [];
  let prevMax = 0;

  for (let i = 0; i < numClasses; i++) {
    const min = Math.max(prevMax + 1, Math.floor(Math.exp(logMin + i * step)));
    const max = i === numClasses - 1 ? maxCount : Math.max(min, Math.floor(Math.exp(logMin + (i + 1) * step)));
    classes.push({ min, max, color: CHOROPLETH_COLORS[i] });
    prevMax = max;
  }
  return classes;
};

export const colorFor = (count, classes) => {
  if (!count) return EMPTY_COLOR;
  const match = classes.find((c) => count >= c.min && count <= c.max);
  return match ? match.color : CHOROPLETH_COLORS[CHOROPLETH_COLORS.length - 1];
};
