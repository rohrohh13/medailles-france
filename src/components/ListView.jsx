import { useMemo } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import MedalTally from './MedalTally';
import { MEDAL_LABELS, countByColor } from '../lib/data';

const ListView = ({ totalCount, medals, hasFilters, athletesById, onSelectAthlete, onOpenFilters }) => {
  const sorted = useMemo(() => [...medals].sort((a, b) => Number(b.year) - Number(a.year)), [medals]);

  return (
    <div className="list-view">
      <aside className="list-view__summary">
        <p className="eyebrow">Depuis 1896</p>
        <p className="hero-number">{totalCount}</p>
        <p className="hero-caption">médailles olympiques françaises</p>
        {hasFilters && (
          <p className="hero-filtered">
            <strong>{medals.length}</strong> correspondent à vos filtres
          </p>
        )}
        <MedalTally counts={countByColor(medals)} size="xl" />
      </aside>

      <section className="list-view__results" aria-live="polite">
        {!hasFilters ? (
          <div className="empty-state">
            <p>Choisissez une saison, un métal, une discipline ou une année pour afficher les médailles.</p>
            <button type="button" className="btn btn--primary" onClick={onOpenFilters}>
              <TuneIcon fontSize="small" /> Choisir des filtres
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="empty-state">
            <p>Aucune médaille ne correspond. Essayez d&apos;élargir les filtres.</p>
          </div>
        ) : (
          <ul className="medal-grid">
            {sorted.map((medal) => (
              <li key={medal.id} className={`medal-card medal-card--${medal.color}`}>
                <div className="medal-card__head">
                  <span className={`pill medal-bg--${medal.color}`}>{MEDAL_LABELS[medal.color]}</span>
                  <span className="medal-card__year">
                    {medal.city || 'JO'} {medal.year}
                  </span>
                </div>
                <h3 className="medal-card__discipline">{medal.discipline}</h3>
                {medal.event && <p className="medal-card__event">{medal.event}</p>}
                <div className="medal-card__athletes">
                  {medal.athleteIds.map((id) => {
                    const athlete = athletesById.get(id);
                    if (!athlete) return null;
                    return (
                      <button key={id} type="button" className="athlete-link" onClick={() => onSelectAthlete(id)}>
                        {athlete.name}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ListView;
