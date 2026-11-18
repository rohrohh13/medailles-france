import { useEffect, useMemo, useState } from 'react';
import { config } from '../../config';
import { buildFilterOptions, indexMedalsByAthlete, normalizeAthlete, normalizeMedal } from '../lib/data';

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

/** Charge médailles et athlètes depuis l'API et prépare les index utiles. */
export const useMedalData = () => {
  const [state, setState] = useState({ status: 'loading', medals: [], athletes: [] });

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchJson(config.medalsUrl, controller.signal),
      fetchJson(config.athletesUrl, controller.signal),
    ])
      .then(([rawMedals, rawAthletes]) => {
        setState({
          status: 'ready',
          medals: rawMedals.map(normalizeMedal),
          athletes: rawAthletes.map(normalizeAthlete),
        });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error(error);
        setState((prev) => ({ ...prev, status: 'error' }));
      });

    return () => controller.abort();
  }, []);

  const derived = useMemo(
    () => ({
      athletesById: new Map(state.athletes.map((a) => [a.id, a])),
      medalsByAthlete: indexMedalsByAthlete(state.medals),
      options: buildFilterOptions(state.medals),
    }),
    [state.medals, state.athletes],
  );

  return { ...state, ...derived };
};
