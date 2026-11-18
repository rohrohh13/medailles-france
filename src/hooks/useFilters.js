import { useCallback, useMemo, useState } from 'react';

const EMPTY_FILTERS = { season: [], color: [], discipline: [], year: [] };

const toggleValue = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const matches = (list, value) => list.length === 0 || list.includes(value);

/** État des filtres et médailles correspondantes. */
export const useFilters = (medals) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const toggle = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: toggleValue(prev[key], value) }));
  }, []);

  const reset = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const activeCount = Object.values(filters).reduce((sum, list) => sum + list.length, 0);

  const filteredMedals = useMemo(
    () =>
      medals.filter(
        (m) =>
          matches(filters.season, m.season) &&
          matches(filters.color, m.color) &&
          matches(filters.discipline, m.discipline) &&
          matches(filters.year, m.year),
      ),
    [medals, filters],
  );

  return { filters, toggle, reset, activeCount, filteredMedals };
};
