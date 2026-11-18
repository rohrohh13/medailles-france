require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Autorise tous les frontends à interroger l'API
app.use(cors());

/**
 * Crée une route qui relaie une feuille de données (OpenSheet).
 * Utilise le fetch natif de Node (>= 18).
 */
const proxySheet = (envKey, errorMessage) => async (_req, res) => {
  const url = process.env[envKey];
  if (!url) {
    return res.status(500).json({ error: `Variable d'environnement ${envKey} manquante` });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    res.json(await response.json());
  } catch (error) {
    console.error(`${errorMessage} :`, error.message);
    res.status(502).json({ error: errorMessage });
  }
};

app.get("/api/medailles", proxySheet("OPEN_SHEET_URL", "Erreur lors de la récupération des médailles"));
app.get("/api/athletes", proxySheet("OPEN_SHEET_ATHLETES", "Erreur lors de la récupération des athlètes"));

app.listen(PORT, () => console.log(`Serveur backend sur http://localhost:${PORT}`));
