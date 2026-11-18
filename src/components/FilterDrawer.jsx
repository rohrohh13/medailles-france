import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { MEDAL_COLORS, MEDAL_LABELS, SEASONS } from '../lib/data';

const SEASON_ICONS = { ete: <WbSunnyIcon fontSize="small" />, hiver: <AcUnitIcon fontSize="small" /> };

const Chip = ({ active, onClick, children, className = '' }) => (
  <button type="button" aria-pressed={active} className={`chip ${active ? 'is-active' : ''} ${className}`} onClick={onClick}>
    {children}
  </button>
);

const Section = ({ title, children }) => (
  <section className="filter-section">
    <h3 className="filter-section__title">{title}</h3>
    <div className="chip-list">{children}</div>
  </section>
);

const FilterDrawer = ({ open, onClose, filters, toggle, reset, activeCount, options, resultCount }) => {
  const showSeason = (season) => filters.season.length === 0 || filters.season.includes(season);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ className: 'drawer drawer--filters' }}>
      <header className="drawer__header">
        <h2>Filtrer les médailles</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
          <CloseIcon />
        </button>
      </header>

      <div className="drawer__body">
        <Section title="Saison">
          {SEASONS.map(({ value, label }) => (
            <Chip key={value} className={`chip--season-${value}`} active={filters.season.includes(value)} onClick={() => toggle('season', value)}>
              {SEASON_ICONS[value]} {label}
            </Chip>
          ))}
        </Section>

        <Section title="Métal">
          {MEDAL_COLORS.map((color) => (
            <Chip key={color} className={`chip--medal chip--${color}`} active={filters.color.includes(color)} onClick={() => toggle('color', color)}>
              <span className={`dot medal-bg--${color}`} /> {MEDAL_LABELS[color]}
            </Chip>
          ))}
        </Section>

        {showSeason('ete') && (
          <Section title="Disciplines d'été">
            {options.disciplines.ete.map((d) => (
              <Chip key={d} active={filters.discipline.includes(d)} onClick={() => toggle('discipline', d)}>
                {d}
              </Chip>
            ))}
          </Section>
        )}

        {showSeason('hiver') && (
          <Section title="Disciplines d'hiver">
            {options.disciplines.hiver.map((d) => (
              <Chip key={d} active={filters.discipline.includes(d)} onClick={() => toggle('discipline', d)}>
                {d}
              </Chip>
            ))}
          </Section>
        )}

        {showSeason('ete') && (
          <Section title="Jeux d'été">
            {options.years.ete.map((y) => (
              <Chip key={y} className="chip--year" active={filters.year.includes(y)} onClick={() => toggle('year', y)}>
                {y}
              </Chip>
            ))}
          </Section>
        )}

        {showSeason('hiver') && (
          <Section title="Jeux d'hiver">
            {options.years.hiver.map((y) => (
              <Chip key={y} className="chip--year" active={filters.year.includes(y)} onClick={() => toggle('year', y)}>
                {y}
              </Chip>
            ))}
          </Section>
        )}
      </div>

      <footer className="drawer__footer">
        <button type="button" className="btn btn--ghost" onClick={reset} disabled={activeCount === 0}>
          Réinitialiser
        </button>
        <button type="button" className="btn btn--primary btn--grow" onClick={onClose}>
          Voir {resultCount} médaille{resultCount > 1 ? 's' : ''}
        </button>
      </footer>
    </Drawer>
  );
};

export default FilterDrawer;
