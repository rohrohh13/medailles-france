import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../config';
import './app.css';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import PublicIcon from '@mui/icons-material/Public';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const medalsUrl = config.medalsUrl;
const athletesUrl = config.athletesUrl;

const Medaille = () => {
  const [medals, setMedals] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [selectedAthleteMedals, setSelectedAthleteMedals] = useState([]);
  const [viewMode, setViewMode] = useState(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(true);

  const [seasonFilter, setSeasonFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [disciplineFilter, setDisciplineFilter] = useState([]);
  const [sexFilter, setSexFilter] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);

  const [allDisciplines, setAllDisciplines] = useState([]);
  const [summerDisciplines, setSummerDisciplines] = useState([]);
  const [winterDisciplines, setWinterDisciplines] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [summerYears, setSummerYears] = useState([]);
  const [winterYears, setWinterYears] = useState([]);
  const [allSexes, setAllSexes] = useState([]);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(true);

  useEffect(() => {
    axios.get(medalsUrl).then((response) => {
      const data = response.data;
      setMedals(data);

      const allDisciplinesSet = [...new Set(data.map(m => m.discipline_medaille))];
      const summerDisciplinesSet = [...new Set(data.filter(m => m.hiver_ou_ete_medaille === 'ete').map(m => m.discipline_medaille))];
      const winterDisciplinesSet = [...new Set(data.filter(m => m.hiver_ou_ete_medaille === 'hiver').map(m => m.discipline_medaille))];

      // Trier les disciplines par ordre alphabétique
      setAllDisciplines(allDisciplinesSet.sort());
      setSummerDisciplines(summerDisciplinesSet.sort());
      setWinterDisciplines(winterDisciplinesSet.sort());

      setAllYears([...new Set(data.map(m => m.annee_medaille))]);
      setSummerYears([...new Set(data.filter(m => m.hiver_ou_ete_medaille === 'ete').map(m => m.annee_medaille))]);
      setWinterYears([...new Set(data.filter(m => m.hiver_ou_ete_medaille === 'hiver').map(m => m.annee_medaille))]);
      setAllSexes([...new Set(data.map(m => m.epreuve_sexe.toLowerCase()))]);
    });

    axios.get(athletesUrl).then((response) => {
      setAthletes(response.data);
    });
  }, []);

  const getFilteredDisciplines = () => {
    if (seasonFilter.length === 0) return allDisciplines;
    return allDisciplines.filter(discipline =>
      medals.some(m => seasonFilter.includes(m.hiver_ou_ete_medaille) && m.discipline_medaille === discipline)
    );
  };

  const getFilteredYears = () => {
    if (seasonFilter.length === 0) return allYears;
    return allYears.filter(year =>
      medals.some(m => seasonFilter.includes(m.hiver_ou_ete_medaille) && m.annee_medaille === year)
    );
  };

  const filteredMedals = medals.filter(medal => {
    const matchesSeason = seasonFilter.length === 0 || seasonFilter.includes(medal.hiver_ou_ete_medaille);
    const matchesColor = colorFilter.length === 0 || colorFilter.includes(medal.couleur_medaille.trim().toLowerCase());
    const matchesDiscipline = disciplineFilter.length === 0 || disciplineFilter.includes(medal.discipline_medaille);
    const matchesSex = sexFilter.length === 0 || sexFilter.includes(medal.epreuve_sexe.toLowerCase());
    const matchesYear = yearFilter.length === 0 || yearFilter.includes(medal.annee_medaille);

    return matchesSeason && matchesColor && matchesDiscipline && matchesSex && matchesYear;
  });

  const getAthletesForMedal = (medal) => {
    if (!medal.athletes_id_medaille) return [];
    const athleteIds = medal.athletes_id_medaille.split(',').map(id => id.trim());
    return athletes.filter(athlete => athleteIds.includes(athlete.id_sportif));
  };

  const getMedalsForAthlete = (athlete) => {
    return medals.filter(medal =>
      medal.athletes_id_medaille.split(',').map(id => id.trim()).includes(athlete.id_sportif)
    );
  };

  const handleAthleteClick = (athlete) => {
    console.log("Athlete clicked:", athlete);
    setSelectedAthlete(athlete);
    setSelectedAthleteMedals(getMedalsForAthlete(athlete));
  };

  const handleDrawerClose = () => {
    console.log("Closing drawer for selected athlete");
    setSelectedAthlete(null);
  };

  const handleFilterDrawerToggle = () => {
    setIsFilterDrawerOpen(prev => !prev);
  };

  const handleCheckboxChange = (setter, value, isChecked) => {
    setter(prev => isChecked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const totalMedals = medals.length;
  const filteredMedalsCount = filteredMedals.length;
  const goldCount = filteredMedals.filter(m => m.couleur_medaille.toLowerCase() === "or").length;
  const silverCount = filteredMedals.filter(m => m.couleur_medaille.toLowerCase() === "argent").length;
  const bronzeCount = filteredMedals.filter(m => m.couleur_medaille.toLowerCase() === "bronze").length;

  const isAnyFilterApplied = seasonFilter.length > 0 || colorFilter.length > 0 || disciplineFilter.length > 0 || sexFilter.length > 0 || yearFilter.length > 0;

  const handleViewModeSelection = (mode) => {
    setViewMode(mode);
    setIsSelectionModalOpen(false);
    if (mode === 'map') {
      setIsFilterDrawerOpen(false);
    }
  };

  const handleHomeButtonClick = () => {
    setViewMode(null);
    setIsSelectionModalOpen(true);
  };

  const athletesWithFilteredMedals = athletes.map(athlete => ({
    ...athlete,
    medals: getMedalsForAthlete(athlete).filter(medal =>
      filteredMedals.some(fm => fm.id_medaille === medal.id_medaille)
    ),
  })).filter(athlete => athlete.medals.length > 0);

  const createCustomIcon = (gender) => {
    const iconHtml = gender === 'homme' ? '♂' : '♀';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-circle">${iconHtml}</div>`,
      iconSize: [30, 30],

    });
  };

  return (
    <div className="la-liste">
      <Dialog className="ouvertureSite" open={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)}>
        <div>
          <h1>Le site des médailles et médaillé·es français·es <br/>dans l'histoire des Jeux Olympiques</h1>
        </div>
        <div className="le-choix">
          <div onClick={() => handleViewModeSelection('list')} color="primary">
            Les médailles
          </div>
          <div onClick={() => handleViewModeSelection('map')} color="primary">
            Les médaillé·es
          </div>
        </div>
      </Dialog>

      {viewMode && (
        <>
          <button className="button-filtre" onClick={handleFilterDrawerToggle}>
            <FilterAltIcon />
          </button>
          <button className="button-home" onClick={handleHomeButtonClick}>
            <HomeIcon />
          </button>

          <div style={{ display: 'flex' }}>
            {viewMode === 'list' && (
              <div className="gauche-liste" style={{ width: '50%' }}>
                <p className="total-medaille">{totalMedals} médailles</p>
                <p className="filtre-medaille">Médailles filtrées : {filteredMedalsCount}</p>
                <p>
                  <span className="medal-circle-compteur medal-circle-gold">{goldCount}</span>
                  <span className="medal-circle-compteur medal-circle-silver">{silverCount}</span>
                  <span className="medal-circle-compteur medal-circle-bronze">{bronzeCount}</span>
                </p>
              </div>
            )}

            <div className="droite-liste" style={{ width: viewMode === 'list' ? '50%' : '100%' }}>
              {viewMode === 'list' && (
                <>
                  {!isAnyFilterApplied ? (
                    <p className="intro-droite">Veuillez sélectionner au moins un filtre pour afficher les résultats.</p>
                  ) : filteredMedals.length === 0 ? (
                    <p className="intro-droite">Aucune médaille trouvée. Veuillez ajuster les filtres.</p>
                  ) : (
                    <div>
                      <h2 className="titre-droite">Les médailles :</h2>
                      {filteredMedals.map(medal => {
                        let disciplineStyle = {};

                        if (medal.couleur_medaille.toLowerCase() === 'or') {
                          disciplineStyle = { color: '#ffd700' };
                        } else if (medal.couleur_medaille.toLowerCase() === 'argent') {
                          disciplineStyle = { color: '#868992' };
                        } else if (medal.couleur_medaille.toLowerCase() === 'bronze') {
                          disciplineStyle = { color: '#775e39' };
                        }

                        return (
                          <div className="bloc-medaille-div" key={medal.id_medaille}>
                            <div className="bloc-medaille">
                              <p style={disciplineStyle}>{medal.discipline_medaille}</p>
                              <ul className="liste-sportif">
                                {getAthletesForMedal(medal).map(athlete => (
                                  <li
                                    key={athlete.id_sportif}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleAthleteClick(athlete)}
                                  >
                                    {athlete.prenom_nom_sportif}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="bloc-medaille-div-annee">JO {medal.annee_medaille}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              {viewMode === 'map' && (
                <MapContainer center={[48.8566, 2.3522]} zoom={2} style={{ height: '100vh', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MarkerClusterGroup showCoverageOnHover={false}>
                    {athletesWithFilteredMedals.map(athlete => {
                      if (!athlete.ville_sportif_x || !athlete.ville_sportif_y) {
                        return null; // Skip athletes without valid coordinates
                      }
                      return (
                        <Marker
                          key={athlete.id_sportif}
                          position={[athlete.ville_sportif_x, athlete.ville_sportif_y]}
                          icon={createCustomIcon(athlete.genre_sportif)}
                          eventHandlers={{
                            click: () => handleAthleteClick(athlete),
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => e.target.closePopup(),
                          }}
                        >
                          <Popup autoClose={false} closeButton={false} offset={[0, -1]}>
                            <div className="popUpCarte">
                              <h3>{athlete.prenom_nom_sportif}</h3>
                              <ul style={{ padding: '0px' }}>
                                {athlete.medals.map(medal => (
                                  <li key={medal.id_medaille} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    {medal.couleur_medaille.toLowerCase() === 'or' && (
                                      <span style={{ backgroundColor: '#ffd700', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></span>
                                    )}
                                    {medal.couleur_medaille.toLowerCase() === 'argent' && (
                                      <span style={{ backgroundColor: '#868992', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></span>
                                    )}
                                    {medal.couleur_medaille.toLowerCase() === 'bronze' && (
                                      <span style={{ backgroundColor: '#775e39', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></span>
                                    )}
                                    {medal.annee_medaille} - {medal.discipline_medaille}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MarkerClusterGroup>
                </MapContainer>
              )}
            </div>
          </div>

          <Drawer
            anchor="right"
            open={selectedAthlete !== null}
            onClose={handleDrawerClose}
            transitionDuration={{ enter: 300, exit: 300 }}
          >
            <div style={{ width: '300px', padding: '20px', position: 'relative' }}>
              <IconButton
                style={{ position: 'absolute', top: '10px', right: '10px' }}
                onClick={handleDrawerClose}
              >
                <CloseIcon />
              </IconButton>
              {selectedAthlete && (
                <div>
                  <h2>{selectedAthlete.prenom_nom_sportif}</h2>
                  <p>
                    <span className="medal-circle medal-circle-gold">{selectedAthlete.id_or}</span>
                    <span className="medal-circle medal-circle-silver">{selectedAthlete.id_argent}</span>
                    <span className="medal-circle medal-circle-bronze">{selectedAthlete.id_bronze}</span>
                  </p>
                  <p>Date de naissance : {selectedAthlete.date_naissance_sportif}</p>
                  <p>Ville : {selectedAthlete.ville_sportif}</p>
                  <p>Discipline : {selectedAthlete.discipline_sportif}</p>

                  <h3>{selectedAthleteMedals.length > 1 ? 'Médailles :' : 'Médaille :'}</h3>
                  <ul style={{ padding: '0px' }}>
                    {selectedAthleteMedals.map(medal => (
                      <li key={medal.id_medaille} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        {medal.couleur_medaille.toLowerCase() === 'or' && (
                          <span style={{ backgroundColor: '#ffd700', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></span>
                        )}
                        {medal.couleur_medaille.toLowerCase() === 'argent' && (
                          <span style={{ backgroundColor: '#868992', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></span>
                        )}
                        {medal.couleur_medaille.toLowerCase() === 'bronze' && (
                          <span style={{ backgroundColor: '#775e39', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></span>
                        )}
                        {medal.annee_medaille} - {medal.epreuve_medaille}
                      </li>
                    ))}
                  </ul>
                  <h3>Restez connecté :</h3>
                  <div style={{ marginTop: '20px' }}>
                    {selectedAthlete.wiki_sportif && (
                      <a
                        href={selectedAthlete.wiki_sportif}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        style={{ marginRight: '10px' }}
                      >
                        <PublicIcon />
                      </a>
                    )}
                    {selectedAthlete.linkedin_sportif && (
                      <a
                        href={selectedAthlete.linkedin_sportif}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        style={{ marginRight: '10px' }}
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                    {selectedAthlete.twitter_sportif && (
                      <a
                        href={selectedAthlete.twitter_sportif}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        style={{ marginRight: '10px' }}
                      >
                        <TwitterIcon />
                      </a>
                    )}
                    {selectedAthlete.site_sportif && (
                      <a
                        href={selectedAthlete.site_sportif}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        style={{ marginRight: '10px' }}
                      >
                        <LanguageIcon />
                      </a>
                    )}
                    {selectedAthlete.insta_sportif && (
                      <a
                        href={selectedAthlete.insta_sportif}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        style={{ marginRight: '10px' }}
                      >
                        <InstagramIcon />
                      </a>
                    )}
                    {selectedAthlete.facebook_sportif && (
                      <a
                        href={selectedAthlete.facebook_sportif}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                        style={{ marginRight: '10px' }}
                      >
                        <FacebookIcon />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Drawer>

          <Drawer
            anchor="right"
            open={isFilterDrawerOpen}
            onClose={handleFilterDrawerToggle}
            transitionDuration={{ enter: 300, exit: 300 }}
          >
            <div style={{ width: '400px', padding: '20px', position: 'relative' }}>
              <IconButton
                style={{ position: 'absolute', top: '10px', right: '10px' }}
                onClick={handleFilterDrawerToggle}
              >
                <CloseIcon />
              </IconButton>
              <h2>Filtrer les Médailles</h2>

              <div>
                <h3>Saison</h3>
                <IconButton
                  onClick={() => handleCheckboxChange(setSeasonFilter, 'hiver', !seasonFilter.includes('hiver'))}
                  style={{ color: seasonFilter.includes('hiver') ? '#ADD8E6' : 'inherit' }}
                >
                  <AcUnitIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleCheckboxChange(setSeasonFilter, 'ete', !seasonFilter.includes('ete'))}
                  style={{ color: seasonFilter.includes('ete') ? 'orange' : 'inherit' }}
                >
                  <WbSunnyIcon />
                </IconButton>
              </div>

              <div className="medal-container">
                <h3>Métal</h3>
                <div className="medal-container-div">
                  <div
                    className={`medal medal-gold ${colorFilter.includes('or') ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange(setColorFilter, 'or', !colorFilter.includes('or'))}
                  >
                    1
                  </div>
                  <div
                    className={`medal medal-silver ${colorFilter.includes('argent') ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange(setColorFilter, 'argent', !colorFilter.includes('argent'))}
                  >
                    2
                  </div>
                  <div
                    className={`medal medal-bronze ${colorFilter.includes('bronze') ? 'active' : ''}`}
                    onClick={() => handleCheckboxChange(setColorFilter, 'bronze', !colorFilter.includes('bronze'))}
                  >
                    3
                  </div>
                </div>
              </div>

              {(seasonFilter.includes('ete') || seasonFilter.length === 0) && (
                <div>
                  <h3>Disciplines d'été</h3>
                  {summerDisciplines.map(discipline => (
                    <button
                      key={discipline}
                      className={`filter-button ${disciplineFilter.includes(discipline) ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange(setDisciplineFilter, discipline, !disciplineFilter.includes(discipline))}
                    >
                      {discipline}
                    </button>
                  ))}
                </div>
              )}

              {(seasonFilter.includes('hiver') || seasonFilter.length === 0) && (
                <div>
                  <h3>Disciplines d'hiver</h3>
                  {winterDisciplines.map(discipline => (
                    <button
                      key={discipline}
                      className={`filter-button ${disciplineFilter.includes(discipline) ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange(setDisciplineFilter, discipline, !disciplineFilter.includes(discipline))}
                    >
                      {discipline}
                    </button>
                  ))}
                </div>
              )}

              {(seasonFilter.includes('ete') || seasonFilter.length === 0) && (
                <div>
                  <h3>Années JO d'été</h3>
                  {summerYears.map(year => (
                    <button
                      key={year}
                      className={`filter-button ${yearFilter.includes(year) ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange(setYearFilter, year, !yearFilter.includes(year))}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}

              {(seasonFilter.includes('hiver') || seasonFilter.length === 0) && (
                <div>
                  <h3>Années JO d'hiver</h3>
                  {winterYears.map(year => (
                    <button
                      key={year}
                      className={`filter-button ${yearFilter.includes(year) ? 'active' : ''}`}
                      onClick={() => handleCheckboxChange(setYearFilter, year, !yearFilter.includes(year))}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Drawer>
        </>
      )}
    </div>
  );
};

export default Medaille;
