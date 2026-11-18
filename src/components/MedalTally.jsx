import { MEDAL_COLORS, MEDAL_LABELS } from '../lib/data';

/** Trois pastilles or / argent / bronze avec leur décompte. */
const MedalTally = ({ counts, size = 'md' }) => (
  <ul className={`tally tally--${size}`}>
    {MEDAL_COLORS.map((color) => (
      <li key={color} className={`tally__item medal-bg--${color}`} title={MEDAL_LABELS[color]}>
        <span className="tally__value">{counts[color]}</span>
        <span className="visually-hidden"> {MEDAL_LABELS[color]}</span>
      </li>
    ))}
  </ul>
);

export default MedalTally;
