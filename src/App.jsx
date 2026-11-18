import { useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import MapView from './components/MapView';
import ListView from './components/ListView';
import FilterDrawer from './components/FilterDrawer';
import AthleteDrawer from './components/AthleteDrawer';
import AboutDrawer from './components/AboutDrawer';
import { useMedalData } from './hooks/useMedalData';
import { useFilters } from './hooks/useFilters';
import { countByColor, indexMedalsByAthlete } from './lib/data';

// Passer à true pour réafficher le volet « Qui suis-je ? »
const SHOW_ABOUT = false;

const App = () => {
  const data = useMedalData();
  const { filters, toggle, reset, activeCount, filteredMedals } = useFilters(data.medals);

  const [view, setView] = useState('map');
  const [mapLayer, setMapLayer] = useState('athletes');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Athlètes ayant au moins une médaille correspondant aux filtres
  const filteredAthletes = useMemo(() => {
    const index = indexMedalsByAthlete(filteredMedals);
    return data.athletes.filter((a) => index.has(a.id)).map((a) => ({ ...a, medals: index.get(a.id) }));
  }, [data.athletes, filteredMedals]);

  // Le volet se ferme si l'athlète sélectionné sort des filtres
  const selectedAthlete = selectedId ? (filteredAthletes.find((a) => a.id === selectedId) ?? null) : null;
  const selectedTotals = countByColor(selectedAthlete ? (data.medalsByAthlete.get(selectedAthlete.id) ?? []) : []);

  return (
    <div className="app">
      <AppHeader
        view={view}
        onViewChange={setView}
        mapLayer={mapLayer}
        onMapLayerChange={setMapLayer}
        activeFilters={activeCount}
        onOpenFilters={() => setFiltersOpen(true)}
        onResetFilters={reset}
      />

      <main className={`app-main app-main--${view}`}>
        {data.status === 'loading' && (
          <div className="status-screen">
            <span className="spinner" aria-hidden="true" />
            <p>Chargement des médailles…</p>
          </div>
        )}
        {data.status === 'error' && (
          <div className="status-screen">
            <p>Impossible de charger les données. Réessayez dans quelques instants.</p>
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Recharger
            </button>
          </div>
        )}
        {data.status === 'ready' &&
          (view === 'map' ? (
            <MapView athletes={filteredAthletes} medals={filteredMedals} layer={mapLayer} onSelectAthlete={setSelectedId} />
          ) : (
            <ListView
              totalCount={data.medals.length}
              medals={filteredMedals}
              hasFilters={activeCount > 0}
              athletesById={data.athletesById}
              onSelectAthlete={setSelectedId}
              onOpenFilters={() => setFiltersOpen(true)}
            />
          ))}
      </main>

      <AppFooter onOpenAbout={SHOW_ABOUT ? () => setAboutOpen(true) : undefined} />

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        toggle={toggle}
        reset={reset}
        activeCount={activeCount}
        options={data.options}
        resultCount={filteredMedals.length}
      />
      <AthleteDrawer athlete={selectedAthlete} totals={selectedTotals} onClose={() => setSelectedId(null)} />
      {SHOW_ABOUT && <AboutDrawer open={aboutOpen} onClose={() => setAboutOpen(false)} />}
    </div>
  );
};

export default App;
