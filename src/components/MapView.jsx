import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import MedalTally from './MedalTally';
import { MEDAL_COLORS, countByColor } from '../lib/data';
import { buildClasses, colorFor } from '../lib/choropleth';

// Pictogrammes Material Icons par discipline (repli : genre de l'athlète)
const DISCIPLINE_ICONS = {
  football: 'sports_soccer',
  'basket-ball': 'sports_basketball',
  'basket 3x3': 'sports_basketball',
  'canoë-kayak': 'kayaking',
  handball: 'sports_handball',
  surf: 'surfing',
  snowboard: 'snowboarding',
  'ski alpin': 'downhill_skiing',
  'patinage artistique': 'ice_skating',
  natation: 'pool',
  'water polo': 'pool',
  'volley-ball': 'sports_volleyball',
  voile: 'sailing',
  aviron: 'rowing',
  tennis: 'sports_tennis',
  'rugby à 7': 'sports_rugby',
  'rugby à xv': 'sports_rugby',
  'cyclisme sur route': 'directions_bike',
  'cyclisme sur piste': 'directions_bike',
  vtt: 'directions_bike',
  bmx: 'directions_bike',
  athlétisme: 'directions_run',
  gymnastique: 'sports_gymnastics',
  judo: 'sports_martial_arts',
  karaté: 'sports_martial_arts',
  taekwondo: 'sports_martial_arts',
  boxe: 'sports_mma',
};

const iconCache = new Map();

const bestColor = (medals) => MEDAL_COLORS.find((c) => medals.some((m) => m.color === c)) ?? 'bronze';

const markerIcon = (athlete) => {
  const glyph = DISCIPLINE_ICONS[athlete.discipline.toLowerCase()] ?? (athlete.gender === 'femme' ? 'female' : 'male');
  const ring = bestColor(athlete.medals);
  const key = `${glyph}|${ring}`;
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      L.divIcon({
        className: 'athlete-marker',
        html: `<span class="athlete-marker__pin medal-ring--${ring}"><i class="material-icons">${glyph}</i></span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -14],
      }),
    );
  }
  return iconCache.get(key);
};

const clusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 34 : count < 100 ? 42 : 50;
  return L.divIcon({
    className: 'cluster-marker',
    html: `<span style="width:${size}px;height:${size}px">${count}</span>`,
    iconSize: [size, size],
  });
};

const AthleteMarkers = ({ athletes, onSelect }) => (
  <MarkerClusterGroup
    key={athletes.map((a) => a.id).join(',')}
    showCoverageOnHover={false}
    iconCreateFunction={clusterIcon}
    maxClusterRadius={50}
  >
    {athletes
      .filter((a) => a.lat !== null && a.lng !== null)
      .map((athlete) => (
        <Marker
          key={athlete.id}
          position={[athlete.lat, athlete.lng]}
          icon={markerIcon(athlete)}
          eventHandlers={{
            click: () => onSelect(athlete.id),
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup autoClose={false} closeButton={false}>
            <div className="map-popup">
              <strong>{athlete.name}</strong>
              <ul>
                {athlete.medals.map((medal) => (
                  <li key={medal.id}>
                    <span className={`dot medal-bg--${medal.color}`} />
                    {medal.year} · {medal.discipline}
                  </li>
                ))}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
  </MarkerClusterGroup>
);

const useDepartmentShapes = (enabled) => {
  const [shapes, setShapes] = useState(null);
  useEffect(() => {
    if (!enabled || shapes) return;
    fetch('/departements.geojson')
      .then((res) => res.json())
      .then(setShapes)
      .catch((err) => console.error(err));
  }, [enabled, shapes]);
  return shapes;
};

const Legend = ({ classes, shapes, statsByDept }) => {
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 720px)').matches);
  const names = shapes?.features.map((f) => f.properties.DDEP_L_LIB?.trim()) ?? [];

  return (
    <div className="map-card map-card--legend glass">
      <button type="button" className="legend__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        Athlètes par département <span aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
      {open && (
        <ul className="legend__list">
          {classes.map((c) => {
            const depts = names.filter((n) => {
              const v = statsByDept[n]?.count ?? 0;
              return v >= c.min && v <= c.max;
            }).length;
            return (
              <li key={c.min}>
                <span className="legend__swatch" style={{ background: c.color }} />
                {c.min === c.max ? c.min : `${c.min} – ${c.max}`}
                <span className="legend__muted">{depts} dép.</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const DepartmentLayer = ({ shapes, statsByDept, classes }) => {
  const style = (feature) => ({
    fillColor: colorFor(statsByDept[feature.properties.DDEP_L_LIB?.trim()]?.count, classes),
    color: '#ffffff',
    weight: 1,
    fillOpacity: 0.8,
  });

  return (
    <GeoJSON
      key={JSON.stringify(statsByDept)}
      data={shapes}
      style={style}
      onEachFeature={(feature, layer) => {
        const name = feature.properties.DDEP_L_LIB?.trim();
        const s = statsByDept[name] ?? { count: 0, homme: 0, femme: 0, or: 0, argent: 0, bronze: 0 };
        layer.bindTooltip(
          `<div class="dept-tooltip">
            <strong>${name}</strong>
            <span>${s.count} athlète${s.count > 1 ? 's' : ''} · ${s.femme} F / ${s.homme} H</span>
            <span><i class="dot medal-bg--or"></i>${s.or} <i class="dot medal-bg--argent"></i>${s.argent} <i class="dot medal-bg--bronze"></i>${s.bronze}</span>
          </div>`,
          { sticky: true, direction: 'top', opacity: 1, className: 'dept-tooltip-wrap' },
        );
        layer.on({
          mouseover: (e) => e.target.setStyle({ fillOpacity: 1, weight: 2 }),
          mouseout: (e) => e.target.setStyle(style(feature)),
        });
      }}
    />
  );
};

const MapView = ({ athletes, medals, layer, onSelectAthlete }) => {
  const shapes = useDepartmentShapes(layer === 'departments');

  const statsByDept = useMemo(() => {
    const stats = {};
    for (const athlete of athletes) {
      if (!athlete.department) continue;
      const s = (stats[athlete.department] ??= { count: 0, homme: 0, femme: 0, or: 0, argent: 0, bronze: 0 });
      s.count += 1;
      if (athlete.gender in s) s[athlete.gender] += 1;
      const c = countByColor(athlete.medals);
      s.or += c.or;
      s.argent += c.argent;
      s.bronze += c.bronze;
    }
    return stats;
  }, [athletes]);

  const classes = useMemo(
    () => buildClasses(Object.fromEntries(Object.entries(statsByDept).map(([k, v]) => [k, v.count]))),
    [statsByDept],
  );

  return (
    <div className="map-view">
      <MapContainer center={[46.6, 2.4]} zoom={6} minZoom={2} zoomControl={false} className="map-view__map">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        {layer === 'departments'
          ? shapes && <DepartmentLayer shapes={shapes} statsByDept={statsByDept} classes={classes} />
          : <AthleteMarkers athletes={athletes} onSelect={onSelectAthlete} />}
      </MapContainer>

      <div className="map-card map-card--stats glass">
        <p className="stat-label">
          <strong>{medals.length}</strong> médaille{medals.length > 1 ? 's' : ''} · <strong>{athletes.length}</strong> athlète
          {athletes.length > 1 ? 's' : ''}
        </p>
        <MedalTally counts={countByColor(medals)} size="sm" />
      </div>

      {layer === 'departments' && classes.length > 0 && <Legend classes={classes} shapes={shapes} statsByDept={statsByDept} />}
    </div>
  );
};

export default MapView;
