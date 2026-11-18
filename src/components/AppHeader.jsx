import TuneIcon from '@mui/icons-material/Tune';
import MapIcon from '@mui/icons-material/Map';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import LayersIcon from '@mui/icons-material/Layers';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Segmented = ({ label, value, options, onChange }) => (
  <div className="segmented" role="radiogroup" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={value === option.value}
        className={`segmented__option ${value === option.value ? 'is-active' : ''}`}
        onClick={() => onChange(option.value)}
        title={option.label}
      >
        {option.icon}
        <span className="segmented__label">{option.label}</span>
      </button>
    ))}
  </div>
);

const AppHeader = ({ view, onViewChange, mapLayer, onMapLayerChange, activeFilters, onOpenFilters, onResetFilters }) => (
  <header className="app-header">
    <div className="brand glass">
      <span className="brand__flag" aria-hidden="true" />
      <h1 className="brand__title">
        {view === 'map' ? 'La carte des médaillé·es' : 'Les médailles'}
        <span className="brand__subtitle">français·es aux Jeux Olympiques</span>
      </h1>
    </div>

    <nav className="toolbar glass" aria-label="Affichage">
      <Segmented
        label="Vue"
        value={view}
        onChange={onViewChange}
        options={[
          { value: 'map', label: 'Carte', icon: <MapIcon fontSize="small" /> },
          { value: 'list', label: 'Médailles', icon: <WorkspacePremiumIcon fontSize="small" /> },
        ]}
      />

      {view === 'map' && (
        <Segmented
          label="Calque"
          value={mapLayer}
          onChange={onMapLayerChange}
          options={[
            { value: 'athletes', label: 'Athlètes', icon: <PersonPinCircleIcon fontSize="small" /> },
            { value: 'departments', label: 'Départements', icon: <LayersIcon fontSize="small" /> },
          ]}
        />
      )}

      <div className="toolbar__group">
        {activeFilters > 0 && (
          <button type="button" className="icon-btn" onClick={onResetFilters} title="Réinitialiser les filtres">
            <RestartAltIcon fontSize="small" />
          </button>
        )}
        <button type="button" className="btn btn--primary" onClick={onOpenFilters}>
          <TuneIcon fontSize="small" />
          <span className="btn__label">Filtres</span>
          {activeFilters > 0 && <span className="badge">{activeFilters}</span>}
        </button>
      </div>
    </nav>
  </header>
);

export default AppHeader;
