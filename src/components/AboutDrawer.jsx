import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';

/** Présentation de l'auteur (actuellement masquée, voir SHOW_ABOUT dans App.jsx). */
const AboutDrawer = ({ open, onClose }) => (
  <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ className: 'drawer drawer--about' }}>
    <header className="drawer__header">
      <h2>Qui suis-je ?</h2>
      <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
        <CloseIcon />
      </button>
    </header>
    <div className="drawer__body prose">
      <p>Bonjour/Bonsoir,</p>
      <p>Déjà, merci d'être sur ce site et d'avoir cliqué sur le point info (vous êtes curieux et c'est un très bon point pour vous). Alors, qui suis-je ? Je m'appelle Romain et, comme vous pouvez l'imaginer, je suis un passionné des Jeux Olympiques (comme certains d'entre vous, j'imagine). Bref, cette passion pour les JO remonte à mon enfance. En gros, j'ai la chance d'être né à Chambéry et d'être Savoyard (non, non, on n'est pas du tout fier de nos origines dans ce département). Et comme vous le savez, l'année 1992 a vu un grand événement s'y dérouler. C'est là que cette passion est née. J'ai eu la chance d'assister à la cérémonie de clôture, mais surtout à la première médaille de l'histoire du biathlon français : ce relais féminin en or. Bon, je ne vais pas vous cacher que je ne m'en souviens pas trop, mon souvenir, c'est surtout la neige qui tombait ce jour-là (j'avais 6 ans…). Ce qui m'a surtout marqué, je crois, c'est la VHS officielle des Jeux Olympiques qu'il y a eu à la maison après. En toute transparence, j'ai plus regardé cette VHS que celle du Roi Lion – c'est vous dire ! Edgar Gropiron dans les bosses, Franck Picard sur la face de Bellevarde, Surya Bonaly sur la glace d'Albertville, Alberto Tomba en argent en slalom aux Ménuires... et j'en passe. Faudrait d'ailleurs que je la cherche sur Vinted et que je l'encadre.</p>
      <p>Savoyard d'origine, je suis désormais un peu Marseillais. Cette ville que je vis maintenant depuis 15 ans et qui m'a vu passer de géomaticien à développeur web (compétences qui sont essentielles ici)  à abonner au Vélodrome.</p>
      <h2>Pourquoi ce site ?</h2>
      <p>En vrai, je ne sais pas trop. Je voulais mettre mes compétences dans un projet qui me tient à cœur, alors j'ai passé beaucoup de temps, les soirs et les week-ends, à le mettre en place. Je vous laisse juger du résultat. En gros, je voulais avoir un accès facile aux médailles par disciplines et par Jeux Olympiques. La majorité des données proviennent de Wikipédia, il peut (et doit) y avoir des erreurs, merci de ne pas vous en offusquer. Vos retours sont ici les bienvenus, n'hésitez donc pas à me contacter par mail. Par ailleurs, ce site n'est qu'une partie du projet que je souhaite mener à terme. En parallèle, je vais monter un site avec des fiches détaillées pour chaque sportif et chaque médaille, mais ça, ça viendra au compte-gouttes. Et au fond de moi, je rêve de pouvoir interviewer quelqu'un de ces champions et championnes (chose que j'imagine pour l'instant mal car je suis quelqu'un de plutôt réservé, et le code m'aide bien pour ça). Au-delà de ça, je compte faire évoluer le côté cartographie du site, j'ai déjà des idées,  elles viendront par la suite.</p>
      <h2>Que dire de plus ?</h2>
      <p>En gros, je pense que ce site est aussi un peu une carte de visite. Si vous avez des projets, des envies de featuring, qui touchent le sport et exclusivement le sport, n'hésitez pas à venir vers moi. J'aimerais bien dans le futur que le milieu sportif fasse partie plus intégrante de ma vie. Le sport, c'est cette chose qui vous fait parfois monter des émotions de manière folle. Si je devais citer un des plus gros chagrins de ma vie, ce serait l'abandon de Thibaut Pinot sur le Tour 2019. De revoir la vidéo avec les commentaires de Guillaume Di Grazia et Jacky Durand, les larmes ont bien du mal à ne pas couler (je sais, je vais vous faire du mal mais voila le lien de la video) . Je veux donc rendre au sport et aux sportifs ce qu'il m'a et m'ont donné : du temps, de l'abnégation, des souvenirs et des émotions.</p>
    </div>
  </Drawer>
);

export default AboutDrawer;
