import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MedalTally from './MedalTally';
import { MEDAL_LABELS } from '../lib/data';

const LINKS = [
  { key: 'wiki', label: 'Wikipédia', Icon: PublicIcon },
  { key: 'site', label: 'Site officiel', Icon: LanguageIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'twitter', label: 'X', Icon: XIcon },
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
];

const AthleteDrawer = ({ athlete, totals, onClose }) => {
  const links = athlete ? LINKS.filter(({ key }) => athlete.links[key]) : [];

  return (
    <Drawer anchor="right" open={Boolean(athlete)} onClose={onClose} PaperProps={{ className: 'drawer drawer--athlete' }}>
      {athlete && (
        <>
          <header className="drawer__header">
            <div>
              <p className="eyebrow">{athlete.discipline}</p>
              <h2>{athlete.name}</h2>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
              <CloseIcon />
            </button>
          </header>

          <div className="drawer__body">
            <MedalTally counts={totals} size="lg" />

            <dl className="facts">
              {athlete.birthDate && (
                <div>
                  <dt>Naissance</dt>
                  <dd>{athlete.birthDate.replaceAll('-', '/')}</dd>
                </div>
              )}
              {athlete.city && (
                <div>
                  <dt>Ville</dt>
                  <dd>{athlete.city}</dd>
                </div>
              )}
              {athlete.department && (
                <div>
                  <dt>Département</dt>
                  <dd>{athlete.department}</dd>
                </div>
              )}
            </dl>

            <h3 className="section-title">{athlete.medals.length > 1 ? 'Médailles' : 'Médaille'}</h3>
            <ul className="medal-rows">
              {athlete.medals.map((medal) => (
                <li key={medal.id} className="medal-row">
                  <span className={`dot dot--lg medal-bg--${medal.color}`} title={MEDAL_LABELS[medal.color]} />
                  <div>
                    <p className="medal-row__event">{medal.event || medal.discipline}</p>
                    <p className="medal-row__meta">
                      {medal.city ? `${medal.city} ${medal.year}` : `JO ${medal.year}`} · {medal.discipline}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {links.length > 0 && (
              <>
                <h3 className="section-title">Restez connecté</h3>
                <div className="link-list">
                  {links.map(({ key, label, Icon }) => (
                    <a key={key} className="icon-btn icon-btn--outlined" href={athlete.links[key]} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}>
                      <Icon fontSize="small" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Drawer>
  );
};

export default AthleteDrawer;
