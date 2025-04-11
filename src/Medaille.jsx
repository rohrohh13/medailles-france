import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../config';
import './app.css';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
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
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);

  useEffect(() => {
    axios.get(medalsUrl).then((response) => {
      const data = response.data;
      setMedals(data);

      const allDisciplinesSet = [...new Set(data.map(m => m.discipline_medaille))];
      const summerDisciplinesSet = [...new Set(data.filter(m => m.hiver_ou_ete_medaille === 'ete').map(m => m.discipline_medaille))];
      const winterDisciplinesSet = [...new Set(data.filter(m => m.hiver_ou_ete_medaille === 'hiver').map(m => m.discipline_medaille))];

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

  const handleInfoDrawerToggle = () => {
    setIsInfoDrawerOpen(prev => !prev);
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

const createCustomIcon = (gender, discipline) => {
  if (discipline.toLowerCase() === 'football') {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-circle"><i class="fas fa-futbol"></i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'basket-ball') {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-circle"><i class="fas fa-basketball-ball"></i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'canoë-kayak' || discipline.toLowerCase() === 'canoe kayak') {
    return L.divIcon({
      className: 'custom-marker custom-marker-kayak',
      html: `<div class="marker-circle"><i class="material-icons">kayaking</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'handball') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">sports_handball</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'surf') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">surfing</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'snowboard') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">snowboarding</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'ski alpin') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">downhill_skiing</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'patinage artistique') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">ice_skating</i></div>`,
      iconSize: [30, 30],
    });
      } else if (discipline.toLowerCase() === 'natation') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">pool</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'volley-ball') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">sports_volleyball</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'voile') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">sailing</i></div>`,
      iconSize: [30, 30],
    });
  } else if (discipline.toLowerCase() === 'aviron') {
    return L.divIcon({
      className: 'custom-marker custom-marker-hand',
      html: `<div class="marker-circle"><i class="material-icons">rowing</i></div>`,
      iconSize: [30, 30],
    });
  } else {
    const iconHtml = gender === 'homme' ? '♂' : '♀';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-circle">${iconHtml}</div>`,
      iconSize: [30, 30],
    });
  }
};



  return (
    <div className="la-liste">
      <Dialog className="ouvertureSite" open={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)}>
        <div>
          <h1>Les médailles et médaillé·es français·es <br/>dans l'histoire des Jeux Olympiques</h1>
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
      <div className="footer">
        <div className="footerRS">
        <a target="_blank" href="">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
            <path d="M21.31,2.331c-2.636,0-6.671,3.82-9.31,7.815C9.361,6.152,5.326,2.331,2.69,2.331C1,2.331,1,4.098,1,4.947 c0,0.551,0.335,4.912,0.577,5.81c0.435,1.622,1.504,3.13,3.108,3.948c-0.552,0.452-0.949,0.984-1.149,1.586 c-0.227,0.68-0.388,2.047,1.08,3.562c1.174,1.211,2.256,1.8,3.31,1.8c1.703,0,3.166-1.91,4.075-3.458 c0.909,1.548,2.372,3.458,4.075,3.458c1.054,0,2.136-0.589,3.31-1.8c1.468-1.514,1.306-2.881,1.08-3.562  c-0.201-0.602-0.598-1.134-1.149-1.586c1.604-0.818,2.674-2.326,3.108-3.948C22.665,9.859,23,5.499,23,4.947  C23,4.098,23,2.331,21.31,2.331z M20.492,10.239c-0.44,1.64-1.885,3.376-4.492,3.044v2.084c1.613,0.36,2.395,1.042,2.567,1.558  c0.185,0.553-0.234,1.141-0.619,1.537c-1.004,1.037-1.605,1.191-1.874,1.191c-0.763,0-2.114-1.852-2.972-3.653h-1.087L12,16.007 L11.985,16h-1.087c-0.859,1.801-2.209,3.653-2.972,3.653c-0.269,0-0.869-0.155-1.874-1.191c-0.384-0.396-0.803-0.984-0.619-1.537  C5.605,16.409,6.387,15.727,8,15.367v-2.084c-2.607,0.332-4.052-1.404-4.492-3.044C3.354,9.666,3,5.613,3,4.947 c0-0.26,0.006-0.445,0.016-0.577C4.794,4.762,8.42,8.073,10.809,12h1.113h0.156h1.113c2.389-3.927,6.014-7.238,7.793-7.63 C20.994,4.502,21,4.688,21,4.947C21,5.613,20.646,9.666,20.492,10.239z"></path>
          </svg>
        </a>
        <a target="_blank" href="">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
              <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path>
          </svg>
        </a>
        <a target="_blank" href="">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
            <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
          </svg>
        </a>
        <a target="_blank" href="">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
          </svg>
        </a>
        </div>
        <div className="copyright">
          <a href="">Mentions légales</a>
          <p>©2025</p>
        </div>
      </div>
      {viewMode && (
        <>
          <button className="button-filtre" onClick={handleFilterDrawerToggle}>
            <FilterAltIcon />
          </button>
          <button className="button-home" onClick={handleHomeButtonClick}>
            <HomeIcon />
          </button>
          <button className="button-info" onClick={handleInfoDrawerToggle}>
            <InfoIcon />
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
                          icon={createCustomIcon(athlete.genre_sportif, athlete.discipline_sportif)}
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

          <Drawer
            anchor="right"
            open={isInfoDrawerOpen}
            onClose={handleInfoDrawerToggle}
            transitionDuration={{ enter: 300, exit: 300 }}
          >
            <div style={{ width: '400px', padding: '20px', position: 'relative' }}>
              <IconButton
                style={{ position: 'absolute', top: '10px', right: '10px' }}
                onClick={handleInfoDrawerToggle}
              >
                <CloseIcon />
              </IconButton>
                <h2>Qui suis-je ?</h2>
                <p>Bonjour/Bonsoir,</p>
                <p>Déjà, merci d'être sur ce site et d'avoir cliqué sur le point info (vous êtes curieux et c'est un très bon point pour vous). Alors, qui suis-je ? Je m'appelle Romain et, comme vous pouvez l'imaginer, je suis un passionné des Jeux Olympiques (comme certains d'entre vous, j'imagine). Bref, cette passion pour les JO remonte à mon enfance. En gros, j'ai la chance d'être né à Chambéry et d'être Savoyard (non, non, on n'est pas du tout fier de nos origines dans ce département). Et comme vous le savez, l'année 1992 a vu un grand événement s'y dérouler. C'est là que cette passion est née. J'ai eu la chance d'assister à la cérémonie de clôture, mais surtout à la première médaille de l'histoire du biathlon français : ce relais féminin en or. Bon, je ne vais pas vous cacher que je ne m'en souviens pas trop, mon souvenir, c'est surtout la neige qui tombait ce jour-là (j'avais 6 ans…). Ce qui m'a surtout marqué, je crois, c'est la VHS officielle des Jeux Olympiques qu'il y a eu à la maison après. En toute transparence, j'ai plus regardé cette VHS que celle du Roi Lion – c'est vous dire ! Edgar Gropiron dans les bosses, Franck Picard sur la face de Bellevarde, Surya Bonaly sur la glace d'Albertville, Alberto Tomba en argent en slalom aux Ménuires... et j'en passe. Faudrait d'ailleurs que je la cherche sur Vinted et que je l'encadre.</p>
                <p>Savoyard d'origine, je suis désormais un peu Marseillais. Cette ville que je vis maintenant depuis 15 ans et qui m'a vu passer de géomaticien à développeur web (compétences qui sont essentielles ici)  à abonner au Vélodrome.</p>
                <h2>Pourquoi ce site ?</h2>
                <p>En vrai, je ne sais pas trop. Je voulais mettre mes compétences dans un projet qui me tient à cœur, alors j'ai passé beaucoup de temps, les soirs et les week-ends, à le mettre en place. Je vous laisse juger du résultat. En gros, je voulais avoir un accès facile aux médailles par disciplines et par Jeux Olympiques. La majorité des données proviennent de Wikipédia, il peut (et doit) y avoir des erreurs, merci de ne pas vous en offusquer. Vos retours sont ici les bienvenus, n'hésitez donc pas à me contacter par mail. Par ailleurs, ce site n'est qu'une partie du projet que je souhaite mener à terme. En parallèle, je vais monter un site avec des fiches détaillées pour chaque sportif et chaque médaille, mais ça, ça viendra au compte-gouttes. Et au fond de moi, je rêve de pouvoir interviewer quelqu'un de ces champions et championnes (chose que j'imagine pour l'instant mal car je suis quelqu'un de plutôt réservé, et le code m'aide bien pour ça). Au-delà de ça, je compte faire évoluer le côté cartographie du site, j'ai déjà des idées,  elles viendront par la suite.</p>
                <h2>Que dire de plus ?</h2>
                <p>En gros, je pense que ce site est aussi un peu une carte de visite. Si vous avez des projets, des envies de featuring, qui touchent le sport et exclusivement le sport, n'hésitez pas à venir vers moi. J'aimerais bien dans le futur que le milieu sportif fasse partie plus intégrante de ma vie. Le sport, c'est cette chose qui vous fait parfois monter des émotions de manière folle. Si je devais citer un des plus gros chagrins de ma vie, ce serait l'abandon de Thibaut Pinot sur le Tour 2019. De revoir la vidéo avec les commentaires de Guillaume Di Grazia et Jacky Durand, les larmes ont bien du mal à ne pas couler (je sais, je vais vous faire du mal mais voila le lien de la video) . Je veux donc rendre au sport et aux sportifs ce qu'il m'a et m'ont donné : du temps, de l'abnégation, des souvenirs et des émotions.</p>
            </div>
          </Drawer>
        </>
      )}
    </div>
  );
};

export default Medaille;
